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
}