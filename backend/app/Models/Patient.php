<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function queues()
    {
        return $this->hasMany(Queue::class)->where('status_id', 1);
    }

    public function growths()
    {
        return $this->hasMany(Growth::class);
    }
}
