<?php

namespace App\Exports;

use App\Models\Item;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class ItemExport implements FromCollection, WithColumnWidths, WithMapping, WithHeadings, WithColumnFormatting
{
    private $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $clinic  = $this->request->clinic ?? null;
        $data    = Item::with('categoryItem')->where('is_delete', false)->where('clinic_id', $clinic)->get();

        return $data;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25.75,
            'B' => 40.75,
            'C' => 25.75,
            'D' => 13.75,
            'E' => 13.75,
            'F' => 13.75,
            'G' => 25.75,
            'H' => 30.75,
        ];
    }

    public function headings(): array
    {
        return [
            'CODE',
            'NAME',
            'CATEGORY',
            'UNIT',
            'BUY PRICE',
            'SELL PRICE',
            'FACTORY',
            'DISTRIBUTOR',
        ];
    }

    public function map($data): array
    {
        return [
            $data->code,
            $data->name,
            $data->categoryItem->name,
            $data->unit,
            $data->buy_price,
            $data->sell_price,
            $data->factory,
            $data->distributor,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'B' => NumberFormat::FORMAT_TEXT,
            'C' => NumberFormat::FORMAT_TEXT,
            'D' => NumberFormat::FORMAT_NUMBER,
            'E' => NumberFormat::FORMAT_NUMBER,
            'F' => NumberFormat::FORMAT_NUMBER,
            'G' => NumberFormat::FORMAT_TEXT,
            'H' => NumberFormat::FORMAT_TEXT,
        ];
    }
}
