<?php

namespace App\Console\Commands;
use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Events\ItemLowStockMail;
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
            $ClinicMail = App\Models\Users::where('employee_id',2)->get();
            foreach($ClinicMail as $data){
                $LowStock = App\Models\ItemSupply::where('stock','<',50)->where('clinic_id', $ClinicMail->employee->clinic_id)->get();
                Mail::to($ClinicMail->email)->send(new ItemLowStockMail($LowStock));
            }
            return response(['success' => 'Messages Notification Sended!']);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}
