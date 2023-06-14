<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function categoryItem()
    {
        return $this->belongsTo(CategoryItem::class);
    }

    public function itemVariants()
    {
        return $this->hasMany(ItemVariant::class);
    }

    public function itemSupplys()
    {
        return $this->hasMany(ItemSupply::class);
    }
}
