<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('nik');
            $table->string('name');
            $table->string('birth_place');
            $table->date('birth_date');
            $table->enum('gender', ['laki-laki', 'perempuan']);;
            $table->longText('address');
            $table->string('phone');
            $table->foreignId('position_id')->nullable();
            $table->foreignId('clinic_id')->nullable();
            $table->boolean('is_delete')->default(false);
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
        Schema::dropIfExists('employees');
    }
}
