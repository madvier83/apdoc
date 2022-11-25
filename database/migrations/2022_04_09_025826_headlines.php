<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Headlines extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('headlines', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->integer('seed');
            $table->string('image', 255);
            $table->tinyInteger('is_published')->default('0');
            $table->timestamps();
            $table->string('header', 255)->nullabe();
            $table->string('caption', 255)->nullabe();
            $table->string('cta_button', 255)->nullabe();
            $table->string('target_url', 255)->nullabe();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('headlines');
    }
}
