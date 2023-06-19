<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemSupply extends Model
{
    use HasFactory;

    protected $table = 'item_supplys';

    protected $guarded = ['id'];

    public function itemVariant()
    {
        return $this->belongsTo(ItemVariant::class);
    }

    public function stockAdjustments()
    {
        return $this->hasMany(StockAdjustment::class);
    }
}
