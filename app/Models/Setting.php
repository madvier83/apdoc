<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    public static function get($key, $default = '')
    {
        $setting = Setting::where('key', $key)->first();

        if (!empty($setting)) {
            return $setting->value;
        } else {
            return (new Setting());
        }
    }

    protected $table = 'settings';
    protected $fillable = ['key','type','value'];
}
