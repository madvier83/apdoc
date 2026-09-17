<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQueuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->string('queue_number', 8);
            $table->string('queue_position', 8)->default(1)->nullable();
            $table->foreignId('status_id')->default(1)->nullable();
            $table->string('prediction_time', 32)->nullable();
            $table->string('actual_time', 32)->nullable();
            $table->foreignId('patient_id');
            $table->timestamps();
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
        Schema::dropIfExists('queues');
    }
}
