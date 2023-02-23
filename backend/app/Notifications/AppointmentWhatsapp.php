<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Events\WhatsappChannel;
use App\Events\Messages\WhatsappMessages;
use Illuminate\Notifications\Messages\MailMessage;

class AppointmentWhatsapp extends Notification
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
    public function WhatsappMessage($notifiable)
    {   
        return (new WhatsappMessages())
            ->WhatsappContent("
            Selamat Pagi Bpk / Ibu {{1}},
            Kami ingin mengkonfirmasi janji untuk {{2}},
            di {{3}} {{4}} Pada hari {{5}}, {{6}}.
            Pukul {{7}}.

            Mohon untuk datang tepat pada waktu yang sudah ditentukan.
            Untuk informasi lebih lanjut silahkan menghubungi kami di No. Whatsapp
            {{8}}

            Salam sehat,
            {{9}}.
            ");
    }
}