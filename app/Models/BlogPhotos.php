<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPhotos extends Model
{
    use HasFactory;
    protected $table = 'blog_photo';
    protected $fillable = ['name','image','seed','blog_id'];
}
