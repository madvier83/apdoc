<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusNotificationToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('daily_sales_summary_status')->default(0)->nullable()->after('is_verified');
            $table->integer('daily_inventory_alerts_status')->default(0)->nullable()->after('daily_sales_summary_status');
            $table->integer('promo_update_notification_status')->default(0)->nullable()->after('daily_inventory_alerts_status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('daily_sales_summary_status');
            $table->dropColumn('daily_inventory_alerts_status');
            $table->dropColumn('promo_update_notification_status');
        });
    }
}
