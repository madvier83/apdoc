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
use Illuminate\Http\Request;

class ReportSalesController extends Controller
{
    public function summary($from, $to) {
        $totalSuccess = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('total');
        $totalCancelled = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('total');
        $discountSuccess = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('discount');
        $discountCancelled = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('discount');

        $data['Gross Sales']    = $totalSuccess + $totalCancelled + $discountSuccess + $discountCancelled;
        $data['Discounts']      = (integer) $discountSuccess;
        $data['Refund']         = $totalCancelled + $discountCancelled;
        $data['Net Sales']      = $data['Gross Sales'] - $data['Discounts'] - $data['Refund'];
        $data['Gratuify']       = 0;
        $data['Tax']            = 0;
        $data['Rounding']       = 0;
        $data['Total']          = $data['Net Sales'];

        return response()->json($data);
    }

    public function gross($from, $to) {
        $totalSuccess = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('total');
        $totalCancelled = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('total');
        $discountSuccess = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('discount');
        $discountCancelled = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('discount');

        $data['Gross Sales']                = $totalSuccess + $totalCancelled + $discountSuccess + $discountCancelled;
        $data['Discounts']                  = $discountSuccess + 0;
        $data['Refund']                     = $totalCancelled + $discountCancelled;
        $data['Net Sales']                  = $data['Gross Sales'] - $data['Discounts'] - $data['Refund'];
        $data['Cost of Goods Sold (COGS)']  = 0;
        $data['Total']                      = $data['Net Sales'];

        return response()->json($data);
    }

    public function payment($from, $to) {
        $payments = Payment::with('categoryPayment')->where('is_delete', false)->get();
        $collection = array();
        $totalQty = 0;
        $totalCollected = 0;

        foreach ($payments as $payment) {
            $qty             = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('payment_id', $payment->id)->where('is_cancelled', false)->count();
            $collected       = (integer) Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('payment_id', $payment->id)->where('is_cancelled', false)->sum('total');
            $totalQty       += $qty;
            $totalCollected += $collected;

            array_push($collection, [
                'name'      => $payment->name,
                'category'  => $payment->categoryPayment->name,
                'qty'       => $qty,
                'total'     => $collected
            ]);
        }

        $data['total']  = $totalCollected;
        $data['qty']    = $totalQty;
        $data['data']   = $collection;

        return response()->json($data);
    }

    public function service($from, $to) {
        $services = Service::where('is_delete', false)->get();
        $collection = array();
        $totalNetSales = 0;
        $totalDiscount = 0;
        $totalGrossSales = 0;
        $totalQty = 0;
        
        foreach ($services as $service) {
            $netSales            = (integer) TransactionService::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('service_id', $service->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('total');
            $discount            = (integer) TransactionService::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('service_id', $service->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
            $grossSales          = $netSales + $discount;
            $qty                 = TransactionService::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('service_id', $service->id)->whereRelation('transaction' ,'is_cancelled', false)->count();
            $totalNetSales      += $netSales;
            $totalDiscount      += $discount;
            $totalGrossSales    += $grossSales;
            $totalQty           += $qty;
            

            array_push($collection, [
                'name'          => $service->name,
                'qty'           => $qty,
                'grossSales'    => $grossSales,
                'discount'      => $discount,
                'netSales'      => $netSales
            ]);
        }

        $data['Net Sales']      = $totalNetSales;
        $data['Discount']       = $totalDiscount;
        $data['Gross Sales']    = $totalGrossSales;
        $data['qty']            = $totalQty;
        $data['data']           = $collection;

        return response()->json($data);
    }

    public function item($from, $to) {
        $items = Item::with('categoryItem')->where('is_delete', false)->get();
        $collection = array();
        $totalNetSales = 0;
        $totalDiscount = 0;
        $totalGrossSales = 0;
        $totalQty = 0;
        foreach ($items as $item) {
            $netSales            = (integer) TransactionItem::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('item_id', $item->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('total');
            $discount            = (integer) TransactionItem::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('item_id', $item->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
            $grossSales          = $netSales + $discount;
            $qty                 = TransactionItem::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('item_id', $item->id)->whereRelation('transaction' ,'is_cancelled', false)->count();
            $totalNetSales      += $netSales;
            $totalDiscount      += $discount;
            $totalGrossSales    += $grossSales;
            $totalQty           += $qty;
            

            array_push($collection, [
                'name'          => $item->name,
                'category'      => $item->categoryItem->name,
                'qty'           => $qty,
                'grossSales'    => $grossSales,
                'discount'      => $discount,
                'netSales'      => $netSales
            ]);
        }

        $data['Net Sales']      = $totalNetSales;
        $data['Discount']       = $totalDiscount;
        $data['Gross Sales']    = $totalGrossSales;
        $data['qty']            = $totalQty;
        $data['data']           = $collection;

        return response()->json($data);
    }

    public function category($from, $to) {
        $categories = CategoryItem::where('is_delete', false)->get();
        $collection = array();
        $totalNetSales = 0;
        $totalDiscount = 0;
        $totalGrossSales = 0;
        $totalQty = 0;

        foreach ($categories as $category) {
            $netSales            = (integer) TransactionItem::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereRelation('item', 'category_item_id', $category->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('total');
            $discount            = (integer) TransactionItem::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereRelation('item', 'category_item_id', $category->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
            $grossSales          = $netSales + $discount;
            $qty                 = TransactionItem::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereRelation('item', 'category_item_id', $category->id)->whereRelation('transaction' ,'is_cancelled', false)->count();
            $totalNetSales      += $netSales;
            $totalDiscount      += $discount;
            $totalGrossSales    += $grossSales;
            $totalQty           += $qty;
            

            array_push($collection, [
                'name'          => $category->name,
                'qty'           => $qty,
                'grossSales'    => $grossSales,
                'discount'      => $discount,
                'netSales'      => $netSales
            ]);
        }

        $data['Net Sales']      = $totalNetSales;
        $data['Discount']       = $totalDiscount;
        $data['Gross Sales']    = $totalGrossSales;
        $data['qty']            = $totalQty;
        $data['data']           = $collection;

        return response()->json($data);
    }

    public function promotion($from, $to) {
        $promotions = Promotion::where('is_delete', false)->get();
        $collection = array();
        $totalQty = 0;
        $totalCollected = 0;

        foreach ($promotions as $promotion) {
            $qtyItem             = TransactionItem::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('promotion_id', $promotion->id)->whereRelation('transaction' ,'is_cancelled', false)->count();
            $collectedItem       = TransactionItem::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('promotion_id', $promotion->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
            $qtyService          = TransactionService::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('promotion_id', $promotion->id)->whereRelation('transaction' ,'is_cancelled', false)->count();
            $collectedService    = TransactionService::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('promotion_id', $promotion->id)->whereRelation('transaction' ,'is_cancelled', false)->sum('discount');
            $totalQty           += $qtyItem + $qtyService;
            $totalCollected     += $collectedItem + $collectedService;

            array_push($collection, [
                'name'      => $promotion->name,
                'discount'  => $promotion->discount,
                'qty'       => $qtyItem + $qtyService,
                'total'     => $collectedItem + $collectedService
            ]);
        }

        $data['total']  = $totalCollected;
        $data['qty']    = $totalQty;
        $data['data']   = $collection;

        return response()->json($data);
    }

    public function collected($from, $to) {
        $employees = Employee::where('is_delete', false)->get();
        $collection = array();
        $totalQty = 0;
        $totalCollected = 0;

        $qty             = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('employee_id', null)->where('is_cancelled', false)->count();
        $collected       = (integer) Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('employee_id', null)->where('is_cancelled', false)->sum('total');
        $totalQty       += $qty;
        $totalCollected += $collected;

        array_push($collection, [
            'name'      => 'Administrator',
            'qty'       => $qty,
            'total'     => $collected
        ]);

        foreach ($employees as $employee) {
            $qty             = Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('employee_id', $employee->id)->where('is_cancelled', false)->count();
            $collected       = (integer) Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('employee_id', $employee->id)->where('is_cancelled', false)->sum('total');
            $totalQty       += $qty;
            $totalCollected += $collected;

            array_push($collection, [
                'name'      => $employee->name,
                'qty'       => $qty,
                'total'     => $collected
            ]);
        }

        $data['total']  = $totalCollected;
        $data['qty']    = $totalQty;
        $data['data']   = $collection;

        return response()->json($data);
    }

    // public function payment($from, $to) {
    //     $payments = Payment::all();
    //     $totalQty = 0;
    //     $total = 0;
        
    //     foreach ($payments as $payment) {
    //         $dataPayment[$payment->name] = [
    //             'qty'   => Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('payment_id', $payment->id)->where('is_cancelled', false)->count(),
    //             'total' => Transaction::whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('payment_id', $payment->id)->where('is_cancelled', false)->sum('total')
    //         ];
    //         $totalQty += $dataPayment[$payment->name]['qty'];
    //         $total += $dataPayment[$payment->name]['total'];
    //     }

    //     $data['total'] = $total;
    //     $data['qty'] = $totalQty;
    //     $data['data'] = $dataPayment;

    //     return response()->json($data);
    // }
}
