<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;

class User extends Model implements AuthenticatableContract, AuthorizableContract, JWTSubject
{
    use Authenticatable, Authorizable, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = ['id'];
    
    protected $casts = [
        'is_verified' => 'boolean',
        'daily_sales_summary_status' => 'boolean',
        'daily_inventory_alerts_status' => 'boolean',
        'is_delete' => 'boolean',
    ];
    // RELATIONSHIPS

    public function clinics()
    {
        return $this->hasMany(Clinic::class);
    }

    public function userSlots()
    {
        return $this->hasMany(UserSlot::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // one to one user with employee
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function recipientMail(){
        return $this->belongsToMany(RecipientMail::class,  'apdoc_id', 'apdoc_id');
    }

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'otp_verification',
        'email_token_verification',
        'password_resets_token'
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
