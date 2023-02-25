<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryOutcome extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function outcomes()
    {
        return $this->hasMany(Outcome::class);
    }
}
