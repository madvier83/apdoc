<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegressionTestingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('regression_testing', function (Blueprint $table) {
            $table->id();
            $table->integer('patient_id')->nullable();
            $table->string('queue_number')->nullable();
            $table->integer('queue_position')->nullable();
            $table->decimal('prediction_time', 10, 2)->nullable();
            $table->decimal('actual_time', 10, 2)->nullable();
            $table->integer('status_id')->nullable();
            $table->integer('clinic_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('regression_testing');
    }
}
