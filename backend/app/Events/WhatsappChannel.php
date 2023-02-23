<?php

namespace App\Events;

use Illuminate\Notifications\Notification;
use Twilio\Rest\Client;

class WhatsappChannel
{
    public function send($notifiable, Notification $notification){
        // get message template from notification using parameter $notifiable
        $message = $notification->WhatsappMessage($notifiable);
        $to = $notification->WhatsappContact();
        $from = "+6289518223591";
        $twilio = new Client('AC2702ffaa52bfe455d9d2f1f01bff4629','45b8cf8fabddb55ce71ec5b9c061a378');

        return $twilio->messages->create('whatsapp:'.$to, [
            'from' => 'whatsapp:'.$from,
            'body' => $message
        ]);
    }
}
