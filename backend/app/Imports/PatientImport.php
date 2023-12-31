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
    }
    
    public function startRow(): int
    {
        return 2;
    }
    
    public function model(array $row)
    {
        return new Patient([
            'nik'         => $row[0],
            'name'        => $row[1],
            'birth_place' => $row[2],
            'birth_date'  => Date::excelToDateTimeObject(intval($row[3]))->format('Y-m-d'),
            'gender'      => $row[4],
            'phone'       => $row[5],
            'address'     => $row[6],
            'clinic_id'   => $this->request->clinic,
        ]);
    }
}
