<?php

namespace App\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    protected $email, $token;
    public function __construct( $email, $token)
    {
        $this->email = $email;
        $this->token = $token;
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
        ->subject('APP Doc - Verification')
        ->view('mails.verification', [
            'email' => $this->email,
            'token' => encrypt($this->token)
        ]);
    }
}
