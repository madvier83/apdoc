<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // one to many employee with position
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function queueDetails()
    {
        return $this->hasMany(QueueDetail::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    // ADDRESS

    public function province()
    {
        return $this->belongsTo(IdProvince::class, 'province_id', 'id');
    }

    public function city()
    {
        return $this->belongsTo(IdCity::class, 'city_id', 'id');
    }

    public function district()
    {
        return $this->belongsTo(IdDistrict::class, 'district_id', 'id');
    }

    public function village()
    {
        return $this->belongsTo(IdVillage::class, 'village_id', 'id');
    }
}
