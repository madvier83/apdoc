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
    public $LowStock;

    public function __construct($LowStock)
    {
        $this->LowStock = $LowStock;
    }

    public function broadcastOn(){
        return ['message'];
    }

    public function broadcastAs(){
        return 'ItemLowStockNotification';
    }
}
