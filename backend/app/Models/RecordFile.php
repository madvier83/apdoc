<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecordFile extends Model
{
    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function record()
    {
        return $this->belongsTo(Record::class);
    }
}
