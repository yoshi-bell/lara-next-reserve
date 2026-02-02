<?php

namespace App\Services;

use App\Models\Shop;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class ShopService
{
    /**
     * フィルター条件に基づいて店舗一覧を取得する
     */
    public function getFilteredShops(array $filters): Collection
    {
        $userId = Auth::id();

        return Shop::with(['area', 'genre'])
            ->withExists(['favorites' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }])
            ->when(data_get($filters, 'area_id'), function ($query, $areaId) {
                $query->where('area_id', $areaId);
            })
            ->when(data_get($filters, 'genre_id'), function ($query, $genreId) {
                $query->where('genre_id', $genreId);
            })
            ->when(data_get($filters, 'name'), function ($query, $name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            ->get();
    }

    /**
     * 店舗詳細を取得する（リレーションをロード済み）
     */
    public function getShopDetail(Shop $shop): Shop
    {
        $userId = Auth::id();

        return $shop->load(['area', 'genre'])
            ->loadExists(['favorites' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }]);
    }

    /**
     * お気に入り登録済みの店舗一覧を取得する
     */
    public function getFavoriteShops(int $userId): Collection
    {
        return Shop::whereHas('favorites', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with(['area', 'genre'])
        ->withExists(['favorites' => function ($query) use ($userId) {
            $query->where('user_id', $userId);
        }])
        ->get();
    }
}
