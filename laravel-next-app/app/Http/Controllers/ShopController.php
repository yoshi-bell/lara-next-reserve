<?php

namespace App\Http\Controllers;

use App\Models\Shop;

use Illuminate\Http\Request;

use App\Http\Resources\ShopResource;

use App\Services\ShopService;



class ShopController extends Controller

{

    protected $shopService;



    public function __construct(ShopService $shopService)

    {

        $this->shopService = $shopService;

    }



    /**

     * 店舗一覧を取得（検索フィルタ対応）

     */

    public function index(Request $request)

    {

        $shops = $this->shopService->getFilteredShops($request->all());



        return ShopResource::collection($shops);

    }



    /**

     * 店舗詳細を取得

     */

    public function show(Shop $shop)

    {

        $shop = $this->shopService->getShopDetail($shop);



        return new ShopResource($shop);

    }

}
