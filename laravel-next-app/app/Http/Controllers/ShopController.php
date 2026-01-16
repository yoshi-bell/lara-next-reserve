<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    /**
     * 店舗一覧を取得（検索フィルタ対応）
     */
    public function index(Request $request)
    {
        $shops = Shop::with(['area', 'genre'])
            ->when($request->area_id, function ($query, $areaId) {
                $query->where('area_id', $areaId);
            })
            ->when($request->genre_id, function ($query, $genreId) {
                $query->where('genre_id', $genreId);
            })
            ->when($request->name, function ($query, $name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            ->get();

        return response()->json($shops);
    }

    /**
     * 店舗詳細を取得
     */
    public function show(Shop $shop)
    {
        $shop->load(['area', 'genre']);
        return response()->json($shop);
    }
}
