<?php

namespace App\Exports;

use App\Models\Position;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class PositionExport implements FromCollection, WithColumnWidths, WithMapping, WithHeadings, WithColumnFormatting
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
        $patient = Position::where('clinic_id', $clinic)->get();

        return $patient;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 50.75,
        ];
    }

    public function headings(): array
    {
        return [
            'NAME',
        ];
    }

    public function map($patient): array
    {
        return [
            $patient->name,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
        ];
    }
}
