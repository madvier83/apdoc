<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Item;
use App\Models\ItemSupply;
use App\Models\Promotion;
use App\Models\Queue;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\TransactionService;
use App\Events\ItemLowStockNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Throwable;

class TransactionController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $transaction = Transaction::with(['patient', 'paymentMethod', 'employee', 'transactionItems', 'transactionItems.item', 'transactionItems.promotion', 'transactionServices', 'transactionServices.service', 'transactionServices.promotion'])
                ->where('clinic_id', $clinic)
                ->orderBy($sortBy, $order)
                ->paginate($perPage);
            } else {
                $transaction = Transaction::with(['patient', 'paymentMethod', 'employee', 'transactionItems', 'transactionItems.item', 'transactionItems.promotion', 'transactionServices', 'transactionServices.service', 'transactionServices.promotion'])->where(function($query) use ($keyword) {
                    $query->where('discount', 'like', '%'.$keyword.'%')
                        ->orWhere('total', 'like', '%'.$keyword.'%')
                        ->orWhere('payment', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                        ->orWhereRelation('patient', 'name', 'like', '%'.$keyword.'%')
                        ->orWhereRelation('payment', 'name', 'like', '%'.$keyword.'%')
                        ->orWhereRelation('employee', 'name', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }

            return response()->json($transaction);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function status($cancelled)
    {
        try {
            $transaction = Transaction::where('is_cancelled', $cancelled)->with(['patient', 'paymentMethod', 'employee', 'transactionItems', 'transactionItems.item', 'transactionItems.promotion', 'transactionServices', 'transactionServices.service', 'transactionServices.promotion'])->get();
    
            return response()->json($transaction);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function code()
    {
        try {
            $alphabet = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            $date = Carbon::now();
            $sYear = substr($date->year, 0, 2);
            $eYear = substr($date->year, 2);
            $bulan = ($date->month % 26);
            $stahun = ($sYear % 26);
            $etahun = ($eYear % 26);
    
            if ($bulan) {
                $kodeBulan = $alphabet[$bulan];
            }
            if ($stahun) {
                $kodesTahun = $alphabet[$stahun];
            }
            if ($etahun) {
                $kodeeTahun = $alphabet[$etahun];
            }
    
            $num = Transaction::whereDate('created_at', Carbon::today())->count();
            if ($num < 9) {
                $genNum = ("00" . $num + 1);
            } elseif ($num < 99) {
                $genNum = ("0" . $num + 1);
            } else {
                $genNum = ($num + 1);
            }
    
            $kode = $date->day . $kodeBulan . $kodesTahun . $kodeeTahun . $genNum;
    
            return $kode;
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        //
    }

    public function updateStock($item_id, $qty)
    {
        $oldStock = ItemSupply::where('item_id', $item_id)->where('stock', '>', 0)->orderBy('expired')->first();

        if($oldStock === '') {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        try {
            $newStock = $oldStock->stock - $qty;    
            
            $oldStock->fill(['stock' => $newStock]);
            $oldStock->save();

            while($newStock < 0) {
                $oldStock->fill(['stock' => 0]);
                $oldStock->save();

                $oldStock = ItemSupply::where('item_id', $item_id)->where('stock', '>', 0)->orderBy('expired')->first();
                $newStock = $oldStock->stock + $newStock;
                $oldStock->fill(['stock' => $newStock]);
                $oldStock->save();
            }
            
            if($newStock < 50){
                $data = ItemSupply::where('item_id', $item_id)->where('stock', '!=', 0)->where('stock','<=',50)->get();
                $message = 'stock item under 50';
                event(new ItemLowStockNotification($message, $data));
            }
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'payment'       => 'required',
        ]);

        try {
            $dataTransaction = [
                'code'          => $this->code(),
                'patient_id'    => $request->patient_id, 
                'payment_id'    => $request->payment_id ?? null,
                'discount'      => 0,
                'total'         => 0,
                'payment'       => $request->payment,
                'employee_id'   => auth()->user()->employee_id ?? null
            ];
            $dataTransaction['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $transaction = Transaction::create($dataTransaction);
            
            $items = collect($request->items);
            $services = collect($request->services);
            $totalDiscount = 0;
            $totalPayment = 0;
            
            foreach ($items as $data) {
                $this->updateStock($data['id'], $data['qty']);
    
                $item = Item::find($data['id']);
                $promotion = Promotion::find($data['promotion_id']);
    
                $qty = $data['qty'];
                $discount = ($promotion == null) ? 0 : ($item->sell_price * $qty) * ($promotion->discount / 100);
                $total = ($item->sell_price * $qty) - $discount;
    
                $dataItem = [
                    'transaction_id'    => $transaction->id,
                    'item_id'           => $data['id'],
                    'promotion_id'      => $data['promotion_id'] ?? null,
                    'qty'               => $qty,
                    'discount'          => $discount,
                    'total'             => $total,
                    'clinic_id'         => $request->clinic_id ?? auth()->user()->employee->clinic_id,
                ];
                
                $totalDiscount += $discount;
                $totalPayment += $total;
                TransactionItem::create($dataItem);
            }
    
            foreach ($services as $data) {
                $service = Service::find($data['id']);
                $promotion = Promotion::find($data['promotion_id']);
    
                $discount = ($promotion == null) ? 0 : $service->price * ($promotion->discount / 100);
                $total =$service->price - $discount;
    
                $dataService = [
                    'transaction_id'    => $transaction->id,
                    'employee_id'       => $data['employee_id'],
                    'service_id'        => $data['id'],
                    'promotion_id'      => $data['promotion_id'] ?? null,
                    'discount'          => $discount,
                    'total'             => $total,
                    'commission'        => $service->commission,
                    'clinic_id'         => $request->clinic_id ?? auth()->user()->employee->clinic_id,
                ];
                
                $totalDiscount += $discount;
                $totalPayment += $total;
                TransactionService::create($dataService);
            }
    
            Transaction::where('id', $transaction->id)->update(['discount' => $totalDiscount, 'total' => $totalPayment]);
            Queue::where('patient_id', $request->patient_id)->update(['status_id' => 3]);
            Appointment::where('patient_id', $request->patient_id)->where('status_id', 2)->update(['status_id' => 3]);
    
            return response()->json(Transaction::find($transaction->id));
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found!'], 404);
        }

        try {
            $data = [
                'is_cancelled' => ($transaction->is_cancelled == 0) ? 1 : 0
            ];
            $transaction->fill($data);
            $transaction->save();
    
            return response()->json(['message' => 'Transaction updated successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        //
    }
}
