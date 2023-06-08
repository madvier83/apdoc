<?php

namespace App\Exports;

use App\Models\Employee;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class EmployeeExport implements FromCollection, WithColumnWidths, WithMapping, WithHeadings, WithColumnFormatting
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
        $data    = Employee::with(['position', 'users'])
                            ->where(function($query) {
                                $query->doesntHave('users')->orWhereRelation('users', 'apdoc_id', null);
                            })
                            ->where('is_delete', false)
                            ->where('clinic_id', $clinic)
                            ->get();

        return $data;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25.75,
            'B' => 25.75,
            'C' => 25.75,
            'D' => 25.75,
            'E' => 25.75,
            'F' => 25.75,
            'G' => 30.75,
            'H' => 100.75,
        ];
    }

    public function headings(): array
    {
        return [
            'NIK',
            'NAME',
            'POSITION',
            'BIRTH PLACE',
            'BURTH DATE (YYYY-MM-DD)',
            'GENDER (MALE/FEMALE)',
            'PHONE',
            'ADDRESS',
        ];
    }

    public function map($data): array
    {
        return [
            $data->nik,
            $data->name,
            $data->position->name,
            $data->birth_place,
            $data->birth_date,
            $data->gender,
            $data->phone,
            $data->address,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'B' => NumberFormat::FORMAT_TEXT,
            'C' => NumberFormat::FORMAT_TEXT,
            'D' => NumberFormat::FORMAT_TEXT,
            'E' => NumberFormat::FORMAT_DATE_DDMMYYYY,
            'F' => NumberFormat::FORMAT_TEXT,
            'G' => NumberFormat::FORMAT_TEXT,
            'H' => NumberFormat::FORMAT_TEXT,
        ];
    }
}
