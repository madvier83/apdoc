<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdukCategory extends Model
{
    use HasFactory;
    protected $table = 'produk_category';
    protected $fillable = ['name','parent_id','seed','slug'];
}