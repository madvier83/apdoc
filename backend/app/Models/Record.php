<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function recordDiagnoses()
    {
        return $this->hasMany(RecordDiagnose::class);
    }

    public function recordFiles()
    {
        return $this->hasMany(RecordFile::class);
    }
}
