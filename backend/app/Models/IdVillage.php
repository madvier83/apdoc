<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdVillage extends Model
{
    use HasFactory;

    protected $table   = "id_villages";
    
    protected $guarded = ['id'];
}
