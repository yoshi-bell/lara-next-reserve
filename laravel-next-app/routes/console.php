<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule; // 追加

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// 予約リマインダー送信 (毎日朝8時)
Schedule::command('app:send-reservation-reminders')->dailyAt('08:00');
