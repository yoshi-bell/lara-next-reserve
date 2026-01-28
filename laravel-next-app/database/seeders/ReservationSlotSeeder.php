<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\ReservationSlot;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ReservationSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 全店舗を取得
        $shops = Shop::all();

        // 今日から1ヶ月先まで
        $startDate = Carbon::today();
        $endDate = Carbon::today()->addMonth();

        foreach ($shops as $shop) {
            $currentDate = $startDate->copy();

            while ($currentDate <= $endDate) {
                // 10:00 から 22:00 まで 30分刻み
                // (実際の店舗の営業時間に合わせるべきですが、今回は簡易的に固定)
                $startTime = $currentDate->copy()->setTime(10, 0);
                $endTime = $currentDate->copy()->setTime(22, 0);

                while ($startTime < $endTime) {
                    ReservationSlot::create([
                        'shop_id' => $shop->id,
                        'slot_datetime' => $startTime->format('Y-m-d H:i:s'),
                        'max_capacity' => $shop->default_capacity ?? 10, // 店舗のキャパシティ、なければ10
                        'current_reserved' => 0,
                    ]);

                    $startTime->addMinutes(ReservationSlot::SLOT_INTERVAL);
                }

                $currentDate->addDay();
            }
        }
    }
}