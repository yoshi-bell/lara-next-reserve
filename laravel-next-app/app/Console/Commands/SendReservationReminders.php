<?php

namespace App\Console\Commands;

use App\Mail\ReservationReminder;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendReservationReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-reservation-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder emails to users who have reservations for tomorrow.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 明日の日付範囲 (00:00:00 ~ 23:59:59)
        $tomorrow = Carbon::tomorrow();
        $endOfTomorrow = Carbon::tomorrow()->endOfDay();

        $reservations = Reservation::with(['user', 'shop'])
            ->whereBetween('start_at', [$tomorrow, $endOfTomorrow])
            ->get();

        $count = 0;

        foreach ($reservations as $reservation) {
            Mail::to($reservation->user->email)->send(new ReservationReminder($reservation));
            $count++;
        }

        $this->info("Sent {$count} reservation reminders.");
        Log::info("Sent {$count} reservation reminders.");
    }
}