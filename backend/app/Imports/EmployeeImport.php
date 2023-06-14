<?php

namespace App\Imports;

use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class EmployeeImport implements ToModel, WithStartRow
{
    protected $request;
    protected $position;

    public function __construct(Request $request)
    {
        $this->request  = $request;
        $this->position = Position::where('clinic_id', $this->request->clinic)->get();
    }
    
    public function startRow(): int
    {
        return 2;
    }
    
    public function model(array $row)
    {
        $position = $this->position->where('name', $row[2])->first();

        return new Employee([
            'nik'         => $row[0],
            'name'        => $row[1],
            'position_id' => $position ? $position->id : null,
            'birth_place' => $row[3],
            'birth_date'  => Date::excelToDateTimeObject(intval($row[4]))->format('Y-m-d'),
            'gender'      => $row[5],
            'phone'       => $row[6],
            'address'     => $row[7],
            'clinic_id'   => $this->request->clinic,
        ]);
    }
}
