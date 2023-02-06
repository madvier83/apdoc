<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
