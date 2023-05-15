<?php

namespace App\Http\Controllers;

use App\Models\CategoryItem;
use App\Models\Employee;
use App\Models\Item;
use App\Models\Payment;
use App\Models\Promotion;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\TransactionService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Throwable;

class ReportSalesController extends Controller
{
    public function summary($clinic, $from, $to) {
        try {
            $totalSuccess = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('total');
            $totalCancelled = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('total');
            $discountSuccess = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('discount');
            $discountCancelled = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('discount');
    
            $chart = array();
    
            $dateFrom = $from;
            $dateTo   = Carbon::createFromFormat('Y-m-d', $to)->addDay(1)->format('Y-m-d');
    
            while ($dateFrom != $dateTo) {
                array_push($chart, [
                    Carbon::createFromFormat('Y-m-d', $dateFrom)->format('d M Y'),
                    Transaction::where('clinic_id', $clinic)->whereDate('created_at', $dateFrom)->sum('discount') + Transaction::where('clinic_id', $clinic)->whereDate('created_at', $dateFrom)->sum('total'),
                    (integer) Transaction::where('clinic_id', $clinic)->whereDate('created_at', $dateFrom)->where('is_cancelled', false)->sum('total'),
                ]);
    
                $dateFrom = Carbon::createFromFormat('Y-m-d', $dateFrom)->addDay(1)->format('Y-m-d');
            }
    
            $data['GrossSales']    = $totalSuccess + $totalCancelled + $discountSuccess + $discountCancelled;
            $data['Discounts']      = (integer) $discountSuccess;
            $data['Refund']         = $totalCancelled + $discountCancelled;
            $data['NetSales']      = $data['GrossSales'] - $data['Discounts'] - $data['Refund'];
            $data['Gratuify']       = 0;
            $data['Tax']            = 0;
            $data['Rounding']       = 0;
            $data['Total']          = $data['NetSales'];
            $data['Chart']          = $chart;
    
            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function gross($clinic, $from, $to) {
        try {
            $totalSuccess = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('total');
            $totalCancelled = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('total');
            $discountSuccess = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('discount');
            $discountCancelled = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('discount');
    
            $data['GrossSales']                = $totalSuccess + $totalCancelled + $discountSuccess + $discountCancelled;
            $data['Discounts']                  = $discountSuccess + 0;
            $data['Refund']                     = $totalCancelled + $discountCancelled;
            $data['NetSales']                  = $data['GrossSales'] - $data['Discounts'] - $data['Refund'];
            $data['Cost of Goods Sold (COGS)']  = 0;
            $data['Total']                      = $data['NetSales'];
    
            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function payment($clinic, $from, $to) {
        try {
            $payments = Payment::with('categoryPayment')->where('is_delete', false)->get();
            $collection = collect();
            $totalQty = 0;
            $totalCollected = 0;

            // Cash
            $qty             = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('payment_id', null)->where('is_cancelled', false)->count();
            $collected       = (integer) Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('payment_id', null)->where('is_cancelled', false)->sum('total');
            $totalQty       += $qty;
            $totalCollected += $collected;

            $collection->push([
                'name'      => 'Cash',
                'category'  => '',
                'qty'       => $qty,
                'total'     => $collected
            ]);
    
            // Non Cash
            foreach ($payments as $payment) {
                $qty             = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('payment_id', $payment->id)->where('is_cancelled', false)->count();
                if ($qty > 0) {
                    $collected       = (integer) Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('payment_id', $payment->id)->where('is_cancelled', false)->sum('total');
                    $totalQty       += $qty;
                    $totalCollected += $collected;
        
                    $collection->push([
                        'name'      => $payment->name,
                        'category'  => $payment->categoryPayment->name,
                        'qty'       => $qty,
                        'total'     => $collected
                    ]);
                }
            }
    
            $data['total']  = $totalCollected;
            $data['qty']    = $totalQty;
            $data['data']   = $collection->sortBy('total', descending:true)->values()->all();
    
            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function service($clinic, $from, $to) {
        try {
            $services = Service::where('is_delete', false)->get();
            $collection = collect();
            $totalNetSales = 0;
            $totalDiscount = 0;
            $totalGrossSales = 0;
            $totalQty = 0;
            
            foreach ($services as $service) {
                $qty                 = TransactionService::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('service_id', $service->id)->whereRelation('transaction' ,'is_cancelled', false)->count();
                if ($qty > 0) {
                    $netSales            = (integer) TransactionService::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('service_id', $service->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('total');
                    $discount            = (integer) TransactionService::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('service_id', $service->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
                    $grossSales          = $netSales + $discount;
                    $totalNetSales      += $netSales;
                    $totalDiscount      += $discount;
                    $totalGrossSales    += $grossSales;
                    $totalQty           += $qty;
                    
        
                    $collection->push([
                        'name'          => $service->name,
                        'qty'           => $qty,
                        'grossSales'    => $grossSales,
                        'discount'      => $discount,
                        'netSales'      => $netSales
                    ]);
                }
            }
    
            $data['NetSales']      = $totalNetSales;
            $data['Discount']       = $totalDiscount;
            $data['GrossSales']    = $totalGrossSales;
            $data['qty']            = $totalQty;
            $data['data']           = $collection->sortBy('qty', descending:true)->values()->all();
    
            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function item($clinic, $from, $to) {
        try {
            $items = Item::with('categoryItem')->where('is_delete', false)->get();
            $collection = collect();
            $totalNetSales = 0;
            $totalDiscount = 0;
            $totalGrossSales = 0;
            $totalQty = 0;

            foreach ($items as $item) {
                $qty                 = TransactionItem::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('item_id', $item->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('qty');
                if ($qty > 0) {
                    $netSales            = (integer) TransactionItem::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('item_id', $item->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('total');
                    $discount            = (integer) TransactionItem::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('item_id', $item->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
                    $grossSales          = $netSales + $discount;
                    $totalNetSales      += $netSales;
                    $totalDiscount      += $discount;
                    $totalGrossSales    += $grossSales;
                    $totalQty           += $qty;
                    
        
                    $collection->push([
                        'name'          => $item->name,
                        'category'      => $item->categoryItem->name,
                        'qty'           => $qty,
                        'grossSales'    => $grossSales,
                        'discount'      => $discount,
                        'netSales'      => $netSales
                    ]);
                }
            }
    
            $data['NetSales']      = $totalNetSales;
            $data['Discount']       = $totalDiscount;
            $data['GrossSales']    = $totalGrossSales;
            $data['qty']            = $totalQty;
            $data['data']           = $collection->sortBy('qty', descending:true)->values()->all();
    
            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function category($clinic, $from, $to) {
        try {
            $categories = CategoryItem::where('is_delete', false)->get();
            $collection = collect();
            $totalNetSales = 0;
            $totalDiscount = 0;
            $totalGrossSales = 0;
            $totalQty = 0;
    
            foreach ($categories as $category) {
                $qty                 = TransactionItem::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereRelation('item', 'category_item_id', $category->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('qty');
                if ($qty > 0) {
                    $netSales            = (integer) TransactionItem::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereRelation('item', 'category_item_id', $category->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('total');
                    $discount            = (integer) TransactionItem::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereRelation('item', 'category_item_id', $category->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
                    $grossSales          = $netSales + $discount;
                    $totalNetSales      += $netSales;
                    $totalDiscount      += $discount;
                    $totalGrossSales    += $grossSales;
                    $totalQty           += $qty;
                    
        
                    $collection->push([
                        'name'          => $category->name,
                        'qty'           => $qty,
                        'grossSales'    => $grossSales,
                        'discount'      => $discount,
                        'netSales'      => $netSales
                    ]);
                }
            }
    
            $data['NetSales']      = $totalNetSales;
            $data['Discount']       = $totalDiscount;
            $data['GrossSales']    = $totalGrossSales;
            $data['qty']            = $totalQty;
            $data['data']           = $collection->sortBy('qty', descending:true)->values()->all();
    
            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function promotion($clinic, $from, $to) {
        try {
            $promotions = Promotion::where('is_delete', false)->get();
            $collection = collect();
            $totalQty = 0;
            $totalCollected = 0;
    
            foreach ($promotions as $promotion) {
                $qtyItem             = TransactionItem::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('promotion_id', $promotion->id)->whereRelation('transaction' ,'is_cancelled', false)->count();
                $qtyService          = TransactionService::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('promotion_id', $promotion->id)->whereRelation('transaction' ,'is_cancelled', false)->count();
                if ($qtyItem > 0 || $qtyService) {
                    $collectedItem       = TransactionItem::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('promotion_id', $promotion->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
                    $collectedService    = TransactionService::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('promotion_id', $promotion->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
                    $totalQty           += $qtyItem + $qtyService;
                    $totalCollected     += $collectedItem + $collectedService;
        
                    $collection->push([
                        'name'      => $promotion->name,
                        'discount'  => $promotion->discount,
                        'qty'       => $qtyItem + $qtyService,
                        'total'     => $collectedItem + $collectedService
                    ]);
                }
            }
    
            $data['total']  = $totalCollected;
            $data['qty']    = $totalQty;
            $data['data']   = $collection->sortBy('qty', descending:true)->values()->all();
    
            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function collected($clinic, $from, $to) {
        try {
            $employees = Employee::where('is_delete', false)->get();
            $collection = collect();
            $totalQty = 0;
            $totalCollected = 0;
    
            // $qty             = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('employee_id', null)->where('is_cancelled', false)->count();
            // $collected       = (integer) Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('employee_id', null)->where('is_cancelled', false)->sum('total');
            // $totalQty       += $qty;
            // $totalCollected += $collected;
    
            // $collection->push([
            //     'name'      => 'Administrator',
            //     'qty'       => $qty,
            //     'total'     => $collected
            // ]);
    
            foreach ($employees as $employee) {
                $qty             = Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('employee_id', $employee->id)->where('is_cancelled', false)->count();
                if ($qty > 0) {
                    $collected       = (integer) Transaction::where('clinic_id', $clinic)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('employee_id', $employee->id)->where('is_cancelled', false)->sum('total');
                    $totalQty       += $qty;
                    $totalCollected += $collected;
        
                    $collection->push([
                        'name'      => $employee->name,
                        'qty'       => $qty,
                        'total'     => $collected
                    ]);
                }
            }
    
            $data['total']  = $totalCollected;
            $data['qty']    = $totalQty;
            $data['data']   = $collection->sortBy('qty', descending:true)->values()->all();
    
            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
