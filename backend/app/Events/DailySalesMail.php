<?php

namespace App\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DailySalesMail extends Event
{
    use Queueable, SerializesModels;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    protected $sales;

    public function __construct($sales)
    {
        $this->sales = $sales;
    }

    public function build()
    {
        return $this
        ->from(env('MAIL_USERNAME'), env('MAIL_FROM_NAME'))
        ->subject('APP Doc - Notification')
        ->view('mails.dailysales', [
            'data' => $this->sales
        ]);
    }
}
