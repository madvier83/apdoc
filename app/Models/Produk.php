<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;

    protected $table = 'produk';
    protected $fillable = ['name',
    'image',
    'price',
    'link_to_olsera',
    'category_id',
    'slug',
    'is_published',
    'is_highlighted'];
}
