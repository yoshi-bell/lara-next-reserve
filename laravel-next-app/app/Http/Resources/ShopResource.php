<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
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
            'name' => $this->name,
            'area_id' => $this->area_id,
            'genre_id' => $this->genre_id,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'default_capacity' => $this->default_capacity,
            'default_stay_time' => $this->default_stay_time,
            
            // Relations (ロードされている場合のみ含める、または常に含めるかの方針による)
            // コントローラーで必ず with(['area', 'genre']) しているので、ここではそのままリソース化
            'area' => new AreaResource($this->whenLoaded('area')),
            'genre' => new GenreResource($this->whenLoaded('genre')),
            
            // withExistsで追加された属性
            'favorites_exists' => $this->when(isset($this->favorites_exists), function () {
                return (bool) $this->favorites_exists;
            }),
        ];
    }
}