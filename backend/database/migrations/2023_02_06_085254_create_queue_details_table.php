<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQueueDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('queue_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('queue_id');
            $table->foreignId('employee_id');
            $table->foreignId('service_id');
            $table->boolean('is_cancelled')->default(false)->nullable();
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
        Schema::dropIfExists('queue_details');
    }
}
