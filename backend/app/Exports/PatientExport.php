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
    private $counter = 0;

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
        $keyword = $this->request->keyword ?? null;

        if ($keyword == null) {
            $patient = Patient::where('clinic_id', $clinic)->orderBy('updated_at', 'desc')->get();
        } else {
            $patient = Patient::where(function($query) use ($keyword) {
                $query->where('nik', 'like', '%'.$keyword.'%')
                    ->orWhere('name', 'like', '%'.$keyword.'%')
                    ->orWhere('birth_place', 'like', '%'.$keyword.'%')
                    ->orWhere('birth_date', 'like', '%'.$keyword.'%')
                    ->orWhere('gender', 'like', '%'.$keyword.'%')
                    ->orWhere('address', 'like', '%'.$keyword.'%')
                    ->orWhere('phone', 'like', '%'.$keyword.'%')
                    ->orWhere('created_at', 'like', '%'.$keyword.'%')
                    ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                })
                ->where('clinic_id', $clinic)
                ->orderBy('updated_at', 'desc')
                ->get();
        }

        return $patient;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 10.75,
            'B' => 25.75,
            'C' => 25.75,
            'D' => 25.75,
            'E' => 20.75,
            'F' => 20.75,
            'G' => 30.75,
            'H' => 100.75,
        ];
    }

    public function headings(): array
    {
        return [
            '#',
            'NIK',
            'NAME',
            'BIRTH PLACE',
            'BURTH DATE',
            'GENDER',
            'PHONE',
            'ADDRESS',
        ];
    }

    public function map($patient): array
    {
        $this->counter++;
        return [
            $this->counter,
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
            'D' => NumberFormat::FORMAT_TEXT,
            'F' => NumberFormat::FORMAT_TEXT,
            'G' => NumberFormat::FORMAT_TEXT,
            'H' => NumberFormat::FORMAT_TEXT,
        ];
    }
}
