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
            $ClinicMail = App\Models\User::where('role_id',2)->where('daily_sales_summary_status', 1)->get();
            foreach($ClinicMail as $dataclinic){
                
                $recipient = App\Models\RecipientMail::where('apdoc_id', $dataclinic->apdoc_id)->with('employee')->get();

                    $from = Carbon::today()->format('Y-m-d');
                    $to = Carbon::today()->format('Y-m-d');

                    $totalSuccess = \App\Models\Transaction::where('clinic_id', $dataclinic->employee->clinic_id)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('total');
                    $totalCancelled = \App\Models\Transaction::where('clinic_id', $dataclinic->employee->clinic_id)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('total');
                    $discountSuccess = \App\Models\Transaction::where('clinic_id', $dataclinic->employee->clinic_id)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', false)->sum('discount');
                    $discountCancelled = \App\Models\Transaction::where('clinic_id', $dataclinic->employee->clinic_id)->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->where('is_cancelled', true)->sum('discount');
                    
                    $chart = array();
                    $dateFrom = $from;
                    $dateTo   = Carbon::createFromFormat('Y-m-d', $to)->addDay(1)->format('Y-m-d');

                    while ($dateFrom != $dateTo) {
                        array_push($chart, [
                            Carbon::createFromFormat('Y-m-d', $dateFrom)->format('d M Y'),
                            App\Models\Transaction::where('clinic_id', $dataclinic->employee->clinic_id)->whereDate('created_at', $dateFrom)->sum('discount') + App\Models\Transaction::where('clinic_id', $dataclinic->employee->clinic_id)->whereDate('created_at', $dateFrom)->sum('total'),
                            (integer) App\Models\Transaction::where('clinic_id', $dataclinic->employee->clinic_id)->whereDate('created_at', $dateFrom)->where('is_cancelled', false)->sum('total'),
                        ]);
                        $dateFrom = Carbon::createFromFormat('Y-m-d', $dateFrom)->addDay(1)->format('Y-m-d');
                    }

                    $data['GrossSales']    = $totalSuccess + $totalCancelled + $discountSuccess + $discountCancelled;
                    $data['Discounts']      = (integer) $discountSuccess;
                    $data['Refund']         = $totalCancelled + $discountCancelled;
                    $data['NetSales']      = $data['GrossSales'] - $data['Discounts'] - $data['Refund'];
                    $data['Gratuify']       = 0;
                    $data['Tax']            = 0;
                    $data['Rounding']       = 0;
                    $data['Total']          = $data['NetSales'];
                    $data['Chart']          = $chart;

                foreach($recipient as $item){
                    Mail::to($item->email)->send(new SalesMail($data));
                }
                Mail::to($dataclinic->email)->send(new SalesMail($data));
            }
            $message = 'Messages Notification Sended!';
            return $message;
        } catch (\Throwable $th) {
            return $th->getMessage();
        }
    }
}
