<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // RELATIONSHIPS

    public function queues()
    {
        return $this->hasMany(Queue::class)->where('status_id', 1);
    }

    public function growths()
    {
        return $this->hasMany(Growth::class);
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
