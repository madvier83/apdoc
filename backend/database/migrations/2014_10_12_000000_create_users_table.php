<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->integer('otp_verification')->nullable();
            $table->datetime('created_at_otp')->nullable();
            $table->datetime('expired_otp')->nullable();
            $table->foreignId('role_id');
            $table->foreignId('outlet_id')->nullable();
            $table->foreignId('employee_id')->nullable();
            $table->string('appdoc_id')->nullable();
            $table->boolean('is_delete')->default(false);
            $table->boolean('is_verified')->default(0);
            $table->datetime('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
