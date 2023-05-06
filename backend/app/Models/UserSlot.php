<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSlot extends Model
{
    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
