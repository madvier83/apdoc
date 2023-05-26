<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecordService extends Model
{
    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function record()
    {
        return $this->belongsTo(Record::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
