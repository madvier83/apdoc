<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transaction_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->nullable();
            $table->foreignId('employee_id')->nullable(); // doctor
            $table->foreignId('service_id')->nullable();
            $table->foreignId('promotion_id')->nullable();
            $table->integer('discount');
            $table->integer('total');
            $table->integer('commission');
            $table->boolean('is_cancelled')->default(false);
            $table->foreignId('clinic_id')->nullable();
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
        Schema::dropIfExists('transaction_services');
    }
}
