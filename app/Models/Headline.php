<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Headline extends Model
{
    use HasFactory;
    protected $table = 'headlines';
    protected $fillable = ['name', 'seed', 'image', 'is_published', 'header', 'caption', 'cta_button', 'target_url'];
}
