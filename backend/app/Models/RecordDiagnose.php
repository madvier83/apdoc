<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecordDiagnose extends Model
{
    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function record()
    {
        return $this->belongsTo(Record::class);
    }

    public function diagnose()
    {
        return $this->belongsTo(Diagnose::class);
    }
}
