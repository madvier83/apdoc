<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdukPhotos extends Model
{
    use HasFactory;

    protected $table = 'produk_photo';
    protected $fillable = ['name','image','seed','produk_id'];
    
}
