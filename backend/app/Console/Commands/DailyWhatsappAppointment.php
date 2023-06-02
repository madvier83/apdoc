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
        try {
        $datas = \App\Models\Appointment::whereDate('appointment_date', Carbon::tomorrow())->get();
            foreach($datas as $data){
                $setting =  \App\Models\Setting::where('clinic_id', $data->clinic_id)->get();
                foreach ($setting as $clinic) {
                    \Notification::route('whatsapp', 'WHATSAPP_SESSION')->notify(new AppointmentWhatsapp($data->patient->name,
                    $data->appointment_date, $data->description,$data->patient->phone,
                    $clinic->name, $clinic->address, $clinic->phone));
                }
            }
        $message = 'Messages Appointment Sended!';
        return $message;
        } catch (\Throwable $th) {
        return $th->getMessage();
        }
    }
}
