<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'shop_id' => $this->shop_id,
            // Carbonインスタンスの場合は文字列化。
            // 既存仕様との互換性のため、まずは文字列としてそのまま返すか、ISO形式にする。
            // フロントエンドは new Date() でパースしているので、ISO 8601 が最も安全。
            'start_at' => $this->start_at instanceof Carbon ? $this->start_at->toIso8601String() : $this->start_at,
            'number' => $this->number,
            'usage_time' => $this->usage_time,
            
            // リレーション
            'shop' => new ShopResource($this->whenLoaded('shop')),
            
            // 履歴表示用（必要であれば）
            // 'deleted_at' => $this->deleted_at, 
        ];
    }
}