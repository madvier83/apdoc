<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // RELATIONSHIP

    public function queueDetails()
    {
        return $this->hasMany(QueueDetail::class);
    }
}
