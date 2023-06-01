<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\SalesMail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class DailySalesNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notification:sales';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Daily Notification Sales';

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
            $ClinicMail = App\Models\User::where('employee_id',2)->where('daily_sales_summary_status', 1)->get();
            foreach($ClinicMail as $data){
                $recipient = App\Models\RecipientMail::where('apdoc_id', $data->apdoc_id)->get();
                $sales = 'test';
                foreach($recipient as $item){
                    Mail::to($item->email)->send(new SalesMail($sales));
                }
                Mail::to($data->email)->send(new SalesMail($sales));
            }
            return response(['message' => 'Messages Notification Sended!']);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}
