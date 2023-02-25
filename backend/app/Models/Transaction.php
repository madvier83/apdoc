<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function transactionServices()
    {
        return $this->hasMany(TransactionService::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function paymentMethod()
    {
        return $this->payment();
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
