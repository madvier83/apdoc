<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipientMail extends Model
{
    //
    protected $table = 'recipient_mail';
    protected $fillable = ['email','apdoc_id'];
    
    public function user(){
        return $this->belongsTo(User::class, 'apdoc_id', 'apdoc_id');
    }
}
