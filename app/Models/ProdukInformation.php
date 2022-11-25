<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdukInformation extends Model
{
    use HasFactory;

    protected $table = 'produk_information';
    protected $fillable = ['name','price','category','produk_id'];
}
