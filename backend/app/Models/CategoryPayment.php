<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryPayment extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
