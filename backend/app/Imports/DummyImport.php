<?php

namespace App\Imports;

use App\Models\Patient;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class PatientImport implements ToModel, WithStartRow
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;

        Patient::where('clinic_id', $this->request->clinic)->truncate();
    }
    
    public function startRow(): int
    {
        return 2;
    }
    
    public function model(array $row)
    {
        return new Patient([
            'nik'         => $row[1],
            'name'        => $row[2],
            'birth_place' => $row[3],
            'birth_date'  => Date::excelToDateTimeObject(intval($row[4]))->format('Y-m-d'),
            'gender'      => $row[5],
            'phone'       => $row[6],
            'address'     => $row[7],
            'clinic_id'   => $this->request->clinic,
        ]);
    }
}
