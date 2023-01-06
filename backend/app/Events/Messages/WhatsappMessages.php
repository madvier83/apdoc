<?php

namespace App\Events\Messages;

class WhatsappMessages
{
    public $content;

    public function WhatsappContent($content)
    {
        return $this->content = $content;
    }
}
