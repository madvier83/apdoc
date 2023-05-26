<?php

namespace App\Console\Commands;
use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Notifications\AppointmentWhatsapp;

class DailyWhatsappAppointment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointment:whatsapp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Whatsapp Appointment';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $datas = \App\Models\Appointment::whereDate('appointment_date', Carbon::tomorrow())->get();
        $setting =  \App\Models\Setting::first();
            foreach($datas as $data){
                \Notification::route('whatsapp', 'WHATSAPP_SESSION')->notify(new WhatsappAppointment($data->patient->name,
                                    $data->appointment_date, $data->description,$data->patient->phone,
                                    $setting->name, $setting->address, $setting->phone));
            }
        return response(['success' => 'Messages Appointment Sended!']);
    }
}
