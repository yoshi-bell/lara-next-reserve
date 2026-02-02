<?php

use Illuminate\Support\Facades\Schedule;

// 予約リマインダー送信 (毎日朝8時)
Schedule::command('app:send-reservation-reminders')->dailyAt('08:00');