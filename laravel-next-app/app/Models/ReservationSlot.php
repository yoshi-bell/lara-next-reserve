<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservationSlot extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationSlotFactory> */
    use HasFactory;

    /** 予約枠の間隔（分） */
    public const SLOT_INTERVAL = 30;

    protected $fillable = [
        'shop_id',
        'slot_datetime',
        'max_capacity',
        'current_reserved',
    ];

    protected function casts(): array
    {
        return [
            'slot_datetime' => 'datetime',
        ];
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
