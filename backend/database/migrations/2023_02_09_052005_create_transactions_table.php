<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 16);
            $table->foreignId('patient_id')->nullable();
            $table->integer('total');
            $table->integer('payment');
            $table->foreignId('employee_id')->nullable(); 
            $table->timestamps();
            $table->integer('discount');
            $table->foreignId('payment_id')->nullable();
            $table->boolean('is_cancelled')->default(false);
            $table->foreignId('clinic_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
