<?php

namespace App\Exports;

use App\Models\Diagnose;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class DiagnoseExport implements FromCollection, WithColumnWidths, WithMapping, WithHeadings, WithColumnFormatting
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
        $data    = Diagnose::where('is_delete', false)->get();

        return $data;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 50.75,
            'B' => 150.75,
        ];
    }

    public function headings(): array
    {
        return [
            'CODE',
            'DESCRIPTION',
        ];
    }

    public function map($data): array
    {
        return [
            $data->code,
            $data->description,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'B' => NumberFormat::FORMAT_TEXT,
        ];
    }
}
