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
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->string('password')->default(app('hash')->make('12345678'));
            $table->string('phone')->nullable()->unique();
            $table->integer('otp_verification')->nullable();
            $table->string('email_token_verification')->nullable();
            $table->timestamp('created_email_token')->nullable();
            $table->timestamp('expired_email_token')->nullable();
            $table->timestamp('created_at_otp')->nullable();
            $table->timestamp('expired_otp')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->foreignId('role_id')->nullable();
            $table->foreignId('employee_id')->nullable();
            $table->string('apdoc_id')->unique()->nullable();
            $table->boolean('is_verified')->default(0);
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
