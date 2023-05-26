<?php

namespace App\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ItemLowStockMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    protected $LowStock;
    
    public function __construct($LowStock)
    {
        $this->LowStock = $LowStock;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
        ->from(env('MAIL_USERNAME'), env('MAIL_FROM_NAME'))
        ->subject('APP Doc - Notification')
        ->view('mails.lowstock', [
            'data' => $this->LowStock
        ]);
    }
}
