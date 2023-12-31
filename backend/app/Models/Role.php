<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function accesses()
    {
        return $this->hasMany(Access::class);
    }
}
