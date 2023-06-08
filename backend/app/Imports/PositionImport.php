<?php

namespace App\Imports;

use App\Models\Position;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class PositionImport implements ToModel, WithStartRow
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
        return new Position([
            'name'        => $row[0],
            'clinic_id'   => $this->request->clinic,
        ]);
    }
}
