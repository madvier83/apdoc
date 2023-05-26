<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ItemLowStockNotification extends Event implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    protected $LowStock,$message;

    public function __construct($LowStock, $message)
    {
        $this->LowStock = $LowStock;
        $this->message = $message;
    }

    public function broadcastOn(){
        return ['message.'.$this->message.'data.'.$this->LowStock];
    }

    public function broadcastAs(){
        return 'Notifications';
    }
}
