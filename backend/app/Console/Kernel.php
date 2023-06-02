<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Laravel\Lumen\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \Laravelista\LumenVendorPublish\VendorPublishCommand::class,
        Commands\LowStockNotification::class,
        Commands\DailyWhatsappAppointment::class,
        Commands\DailySalesNotifications::class,
    ];

    public function scheduleTimezone()
    {
        return 'Asia/Jakarta';
    }
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('appointment:whatsapp')->dailyAt('08:00')->appendOutputTo('scheduler.log')->onOneServer();
        $schedule->command('notification:stock')->dailyAt('08:00')->appendOutputTo('notification.log')->onOneServer();
        $schedule->command('notification:sales')->dailyAt('08:00')->appendOutputTo('notification.log')->onOneServer();
    }
}
