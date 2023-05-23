<?php

namespace App\Imports;

use App\Models\Patient;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class PatientImport implements ToModel, WithStartRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
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
            'birth_date'  => $row[4],
            'gender'      => $row[5],
            'phone'       => $row[6],
            'address'     => $row[7],
            'clinic_id'   => 2,
        ]);
    }
}
