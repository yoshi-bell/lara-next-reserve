<?php

namespace App\Http\Controllers;

use App\Models\Favorite;

use App\Models\Shop;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

use App\Http\Resources\ShopResource;

use App\Services\ShopService;



class FavoriteController extends Controller

{

    protected $shopService;



    public function __construct(ShopService $shopService)

    {

        $this->shopService = $shopService;

    }



    /**

     * お気に入り店舗一覧を取得

     */

    public function index()

    {

        $shops = $this->shopService->getFavoriteShops(Auth::id());



        return ShopResource::collection($shops);

    }

    /**
     * お気に入りを登録
     */
    public function store(Request $request, Shop $shop)
    {
        $user = Auth::user();

        // 既にお気に入り登録済みか確認
        $existingFavorite = Favorite::where('user_id', $user->id)
            ->where('shop_id', $shop->id)
            ->first();

        if ($existingFavorite) {
            return response()->json(['message' => 'Already favorited'], 200);
        }

        Favorite::create([
            'user_id' => $user->id,
            'shop_id' => $shop->id,
        ]);

        return response()->json(['message' => 'Favorited successfully'], 201);
    }

    /**
     * お気に入りを解除
     */
    public function destroy(Shop $shop)
    {
        $user = Auth::user();

        $favorite = Favorite::where('user_id', $user->id)
            ->where('shop_id', $shop->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Unfavorited successfully'], 200);
        }

        return response()->json(['message' => 'Not favorited'], 404);
    }
}