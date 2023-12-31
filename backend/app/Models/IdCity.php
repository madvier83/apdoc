<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdCity extends Model
{
    use HasFactory;

    protected $table   = "id_cities";
    
    protected $guarded = ['id'];
}
