<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Throwable;

class ItemController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $item = Item::with(['categoryItem', 'itemVariants', 'itemVariants.itemSupplys'])->where('is_delete', false)->where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $item = Item::with(['categoryItem', 'itemVariants', 'itemVariants.itemSupplys'])
                    ->where(function($query) use ($keyword) {
                        $query->where('code', 'like', '%'.$keyword.'%')
                            ->orWhere('name', 'like', '%'.$keyword.'%')
                            ->orWhere('factory', 'like', '%'.$keyword.'%')
                            ->orWhere('distributor', 'like', '%'.$keyword.'%')
                            ->orWhere('created_at', 'like', '%'.$keyword.'%')
                            ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                            ->orWhereRelation('categoryItem', 'name', 'like', '%'.$keyword.'%');
                    })
                    ->where('is_delete', false)
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($item);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $item = Item::with('categoryItem')->find($id);
    
            return response()->json($item);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $unique = Item::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('code', $request->code)->first();

        if ($unique) {
            return response()->json(['message' => 'The code has already been taken.'], 400);
        }

        $this->validate($request, [
            'category_item_id'  => 'required',
            'code'              => 'required',
            'name'              => 'required',
            'factory'           => 'required',
            'distributor'       => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $item = Item::create($data);
    
            return response()->json($item);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found!'], 404);
        }

        $this->validate($request, [
            'category_item_id'  => 'required',
            'code'              => 'required',
            'name'              => 'required',
            'factory'           => 'required',
            'distributor'       => 'required',
        ]);

        if($item->code != $request->code) {
            $unique = Item::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('code', $request->code)->first();
    
            if ($unique) {
                return response()->json(['message' => 'The code has already been taken.'], 400);
            }
        }

        try {
            $data = $request->all();
            $item->fill($data);
            $item->save();
    
            return response()->json($item);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found!'], 404);
        }

        try {
            $item->fill(['is_delete' => true]);
            $item->save();
    
            return response()->json(['message' => 'Item deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function lowstock(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $items = Item::with(['categoryItem'])
                    ->withSum('itemSupplys as item_stock', 'stock')
                    ->where('is_delete', false)
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->get();
            } else {
                $items = Item::with(['categoryItem'])
                    ->withSum('itemSupplys as item_stock', 'stock')
                    ->where(function($query) use ($keyword) {
                        $query->where('code', 'like', '%'.$keyword.'%')
                            ->orWhere('name', 'like', '%'.$keyword.'%')
                            ->orWhere('unit', 'like', '%'.$keyword.'%')
                            ->orWhere('sell_price', 'like', '%'.$keyword.'%')
                            ->orWhere('buy_price', 'like', '%'.$keyword.'%')
                            ->orWhere('factory', 'like', '%'.$keyword.'%')
                            ->orWhere('distributor', 'like', '%'.$keyword.'%')
                            ->orWhere('created_at', 'like', '%'.$keyword.'%')
                            ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                            ->orWhereRelation('categoryItem', 'name', 'like', '%'.$keyword.'%');
                    })
                    ->where('is_delete', false)
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->get();
            }

            return $items->where('item_stock', '<', 50)->toQuery()->withSum('itemSupplys as item_stock', 'stock')->paginate($perPage);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
