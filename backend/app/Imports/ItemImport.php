<?php

namespace App\Imports;

use App\Models\CategoryItem;
use App\Models\Item;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class ItemImport implements ToModel, WithStartRow
{
    protected $request;
    protected $category;

    public function __construct(Request $request)
    {
        $this->request  = $request;
        $this->category = CategoryItem::where('clinic_id', $this->request->clinic)->get();
    }
    
    public function startRow(): int
    {
        return 2;
    }
    
    public function model(array $row)
    {
        $category = $this->category->where('name', $row[2])->first();

        return new Item([
            'code'             => $row[0],
            'name'             => $row[1],
            'category_item_id' => $category ? $category->id : null,
            'unit'             => $row[3],
            'sell_price'       => $row[4],
            'buy_price'        => $row[5],
            'factory'          => $row[6],
            'distributor'      => $row[7],
            'clinic_id'        => $this->request->clinic,
        ]);
    }
}
