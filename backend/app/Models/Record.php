<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function recordItems()
    {
        return $this->hasMany(RecordItem::class);
    }

    public function recordServices()
    {
        return $this->hasMany(RecordService::class);
    }

    public function recordDiagnoses()
    {
        return $this->hasMany(RecordDiagnose::class);
    }

    public function recordFiles()
    {
        return $this->hasMany(RecordFile::class);
    }
}
