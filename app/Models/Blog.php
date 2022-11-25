<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;
    protected $table = 'blog';
    protected $fillable = ['name',
    'image',
    'category_id',
    'content',
    'slug',
    'is_published',
    'is_highlighted'];
}
