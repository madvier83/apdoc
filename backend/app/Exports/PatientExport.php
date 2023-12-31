<?php

namespace App\Exports;

use App\Models\Patient;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class PatientExport implements FromCollection, WithColumnWidths, WithMapping, WithHeadings, WithColumnFormatting
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
        $patient = Patient::where('is_delete', false)->where('clinic_id', $clinic)->get();

        return $patient;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25.75,
            'B' => 25.75,
            'C' => 25.75,
            'D' => 25.75,
            'E' => 25.75,
            'F' => 30.75,
            'G' => 100.75,
        ];
    }

    public function headings(): array
    {
        return [
            'NIK',
            'NAME',
            'BIRTH PLACE',
            'BURTH DATE (YYYY-MM-DD)',
            'GENDER (MALE/FEMALE)',
            'PHONE',
            'ADDRESS',
        ];
    }

    public function map($patient): array
    {
        return [
            $patient->nik,
            $patient->name,
            $patient->birth_place,
            $patient->birth_date,
            $patient->gender,
            $patient->phone,
            $patient->address,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'B' => NumberFormat::FORMAT_TEXT,
            'C' => NumberFormat::FORMAT_TEXT,
            'D' => NumberFormat::FORMAT_DATE_DDMMYYYY,
            'E' => NumberFormat::FORMAT_TEXT,
            'F' => NumberFormat::FORMAT_TEXT,
            'G' => NumberFormat::FORMAT_TEXT,
        ];
    }
}
