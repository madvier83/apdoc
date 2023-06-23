<?php

namespace App\Imports;

use App\Models\Diagnose;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class DiagnoseImport implements ToModel, WithStartRow
{
    public function startRow(): int
    {
        return 2;
    }
    
    public function model(array $row)
    {
        return new Diagnose([
            'code'          => $row[0],
            'description'   => $row[1],
        ]);
    }
}
