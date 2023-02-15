<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemSupply;
use App\Models\Promotion;
use App\Models\Queue;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\TransactionService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        //
    }

    public function code()
    {

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
    }

    public function show($id)
    {
        //
    }

    public function updateStock($id, $qty)
    {
        $oldStock = ItemSupply::where('item_id', $id)->where('stock', '>', 0)->orderBy('expired')->first();

        if($oldStock === '') {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        $newStock = $oldStock->stock - $qty;
        ItemSupply::where('id', $id)->update(['stock' => $newStock]);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'patient_id'    => 'required',
            'payment_id'    => 'required',
            'payment'       => 'required',
        ]);

        $dataTransaction = [
            'code'          => $this->code(),
            'patient_id'    => $request->patient_id, 
            'payment_id'    => $request->payment_id,
            'total'         => 0,
            'payment'       => $request->payment,
            'employee_id'   => auth()->user()->employees->id ?? null
        ];

        $transaction = Transaction::create($dataTransaction);
        
        $items = collect($request->items);
        $services = collect($request->services);
        $totalPayment = 0;
        
        foreach ($items as $data) {
            $this->updateStock($data['id'], $data['qty']);

            $item = Item::find($data['id']);
            $promotion = Promotion::find($data['promotion_id']);

            $qty = $data['qty'];
            $discount = ($item->sell_price * $qty) * ($promotion->discount / 100);
            $total = ($item->sell_price * $qty) - $discount;

            $dataItem = [
                'transaction_id'    => $transaction->id,
                'item_id'           => $data['id'],
                'promotion_id'      => $data['promotion_id'],
                'qty'               => $qty,
                'discount'          => $discount,
                'total'             => $total,
            ];
            
            $totalPayment += $total;
            TransactionItem::create($dataItem);
        }

        foreach ($services as $data) {
            $service = Service::find($data['id']);
            $promotion = Promotion::find($data['promotion_id']);

            $discount = $service->price * ($promotion->discount / 100);
            $total =$service->price - $discount;

            $dataService = [
                'transaction_id'    => $transaction->id,
                'employee_id'       => $data['employee_id'],
                'service_id'        => $data['id'],
                'promotion_id'      => $data['promotion_id'],
                'discount'          => $discount,
                'total'             => $total,
                'commission'        => $service->commission,
            ];
            
            $totalPayment += $total;
            TransactionService::create($dataService);
        }

        Transaction::where('id', $transaction->id)->update(['total' => $totalPayment]);
        Queue::where('patient_id', $request->patient_id)->update(['status_id' => 3]);

        return response()->json('Transaction successfully');
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
