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

    protected $name, $date, $description, $to, $clinicname, $clinicaddress, $clinicphone;

    public function __construct($name, $date, $description, $to, $clinicname, $clinicaddress, $clinicphone)
    {
        $this->name = $name;
        $this->date = $date;
        $this->description = $description;
        $this->to = $to;
        $this->clinicname = $clinicname;
        $this->clinicaddress = $clinicaddress;
        $this->clinicphone = $clinicphone;
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
        return $this->to;
    }
    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function WhatsappMessage($notifiable)
    {   
        setlocale(LC_TIME, 'id_ID.utf8');
        $day = strftime('%A', strtotime($this->date));
        $date = strftime('%d %B %Y', strtotime($this->date));
        $time = date('H:i A', strtotime($this->date));
        $appointment = "{$day} {$date} {$time}";
        // return (new WhatsappMessages())
        //     ->WhatsappContent("Selamat Pagi Bpk / Ibu {$this->name},
        //     Kami ingin mengkonfirmasi janji untuk {$this->description},
        //     di {$this->clinicname} {$this->clinicaddress} Pada hari {$day}, {$date}.
        //     Pukul {$time}.
        //     Mohon untuk datang tepat pada waktu yang sudah ditentukan.
        //     Untuk informasi lebih lanjut silahkan menghubungi kami di No. Whatsapp
        //     {$this->clinicphone}.
        //     Salam sehat,
        //     {$this->clinicname}.");
        return (new WhatsappMessages())->WhatsappContent("Good Morning {$this->name},You have appointment on {$appointment}.");
    }
}