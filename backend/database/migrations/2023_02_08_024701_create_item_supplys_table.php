<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemSupplysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_supplys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_variant_id')->nullable();
            $table->integer('total');
            $table->integer('before');
            $table->integer('after');
            $table->date('manufacturing');
            $table->date('expired');
            $table->integer('stock');
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
        Schema::dropIfExists('item_supplys');
    }
}
