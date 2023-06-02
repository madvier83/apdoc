<?php

namespace App\Console\Commands;
use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Events\ItemLowStockMail;
use Illuminate\Support\Facades\Mail;

class LowStockNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notification:stock';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'LowStock Notification';

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
            $ClinicMail = App\Models\User::where('role_id',2)->where('daily_inventory_alerts_status', 1)->get();
            foreach($ClinicMail as $data){
                $recipient = App\Models\RecipientMail::where('apdoc_id', $data->apdoc_id)->get();
                $LowStock = App\Models\ItemSupply::where('stock','<',50)->where('clinic_id', $data->employee->clinic_id)->get();
                foreach($recipient as $item){
                    Mail::to($item->email)->send(new ItemLowStockMail($LowStock));
                }
                Mail::to($data->email)->send(new ItemLowStockMail($LowStock));
            }
            return response(['message' => 'Messages Notification Sended!']);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}