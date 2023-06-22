<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecordItem extends Model
{
    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function record()
    {
        return $this->belongsTo(Record::class);
    }

    public function itemVariant()
    {
        return $this->belongsTo(ItemVariant::class);
    }
}
