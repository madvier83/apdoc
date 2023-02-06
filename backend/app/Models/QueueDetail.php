<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QueueDetail extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function queue()
    {
        return $this->belongsTo(Queue::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
