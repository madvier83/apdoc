<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Events\WhatsappChannel;
use App\Events\Messages\WhatsappMessages;
use Illuminate\Notifications\Messages\MailMessage;

class OTPWhatsapp extends Notification
{
    use Queueable;

    protected $phone, $otp_verification;

    public function __construct($phone, $otp_verification)
    {
        $this->phone = $phone;
        $this->otp_verification = $otp_verification;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [WhatsappChannel::class];
    }

    public function WhatsappContact()
    {
        return $this->phone;
    }
    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function WhatsappOTP($notifiable)
    {   
        return (new WhatsappMessages())
            ->WhatsappContent("Use this {$this->otp_verification} code for verify your account, don't give it to other, the estimation time for code is 5 minutes.");
    }
}