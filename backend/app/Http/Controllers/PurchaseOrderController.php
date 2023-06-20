<?php

namespace App\Http\Controllers;

use App\Models\ItemSupply;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Throwable;

class PurchaseOrderController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $purchaseOrder = PurchaseOrder::with(['supplier', 'purchaseOrderItems.itemVariant.item'])
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            } else {
                $purchaseOrder = PurchaseOrder::with(['supplier', 'purchaseOrderItems.itemVariant.item'])
                    ->where(function($query) use ($keyword) {
                        $query->where('note', 'like', '%'.$keyword.'%')
                            ->orWhereRelation('supplier', 'name', 'like', '%'.$keyword.'%')
                            ->orWhereRelation('purchaseOrderItems.itemVariant', 'variant', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($purchaseOrder);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'purchaseOrderItems.itemVariant.item'])->find($id);
        return response()->json($purchaseOrder);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'supplier_id' => 'required',
            'note'        => 'required',
            'items'       => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $purchaseOrder = PurchaseOrder::create($data);
            
            // PurchaseOrder Item
            if ($request->items) {
                foreach ($request->items as $data) {
                    $data = [
                        'purchase_order_id' => $purchaseOrder->id,
                        'item_variant_id'   => $data["item_variant_id"] ?? null,
                        'qty'               => $data["qty"] ?? null,
                        'cost'              => $data["cost"] ?? null,
                        'manufacturing'     => $data["manufacturing"] ?? null,
                        'expired'           => $data["expired"] ?? null,
                    ];
                    PurchaseOrderItem::create($data);
                }
            }
    
            return response()->json($purchaseOrder);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $purchaseOrder = PurchaseOrder::find($id);

        if (!$purchaseOrder) {
            return response()->json(['message' => 'PurchaseOrder not found!'], 404);
        }

        $this->validate($request, [
            'supplier_id' => 'required',
            'note'        => 'required',
            'items'       => 'required',
        ]);

        try {
            $data = $request->all();
            $data['employee_id'] = auth()->user()->employee_id ?? null;
    
            $purchaseOrder->fill($data);
            $purchaseOrder->save();
    
            // PurchaseOrder Item
            if ($request->items) {
                PurchaseOrderItem::where('purchase_order_id', $purchaseOrder->id)->delete();
                foreach ($request->items as $data) {
                    $data = [
                        'purchase_order_id' => $purchaseOrder->id,
                        'item_variant_id'   => $data["item_variant_id"] ?? null,
                        'qty'               => $data["qty"] ?? null,
                        'cost'              => $data["cost"] ?? null,
                        'manufacturing'     => $data["manufacturing"] ?? null,
                        'expired'           => $data["expired"] ?? null,
                    ];
                    PurchaseOrderItem::create($data);
                }
            } else {
                PurchaseOrderItem::where('purchase_order_id', $purchaseOrder->id)->delete();
            }
    
            return response()->json($purchaseOrder);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function updateFinished($id)
    {
        $purchaseOrder = PurchaseOrder::find($id);

        if (!$purchaseOrder) {
            return response()->json(['message' => 'PurchaseOrder not found!'], 404);
        }

        try {
            $items = PurchaseOrderItem::where('purchase_order_id', $id)->where('is_finished', 0)->get();

            foreach($items as $data) {
                $before = ItemSupply::where('item_variant_id', $data->item_variant_id)->get()->sum('stock');
    
                $data = [
                    'item_variant_id' => $data->item_variant_id,
                    'total'           => $data->qty,
                    'before'          => $before,
                    'after'           => $before + $data->qty,
                    'manufacturing'   => $data->manufacturing,
                    'expired'         => $data->expired,
                    'note'            => $purchaseOrder->note ?? '-',
                    'stock'           => $data->qty,
                ];

                $data['clinic_id'] = $purchaseOrder->clinic_id ?? auth()->user()->employee->clinic_id;
                ItemSupply::create($data);
            }

            $items = PurchaseOrderItem::where('purchase_order_id', $id)->where('is_finished', 0)->update(['is_finished' => 1]);

            $purchaseOrder->fill(['is_finished' => 1]);
            $purchaseOrder->save();
    
            return response()->json(['message' => 'PurchaseOrder update finished successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $purchaseOrder = PurchaseOrder::find($id);

        if (!$purchaseOrder) {
            return response()->json(['message' => 'PurchaseOrder not found!'], 404);
        }

        try {
            $purchaseOrder->delete();
            PurchaseOrderItem::where('purchase_order_id', $id)->delete();
            // $purchaseOrder->fill(['is_delete' => true]);
            // $purchaseOrder->save();
    
            return response()->json(['message' => 'PurchaseOrder deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
