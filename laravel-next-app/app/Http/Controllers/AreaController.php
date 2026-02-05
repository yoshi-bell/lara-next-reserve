<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;

use App\Http\Resources\AreaResource;

class AreaController extends Controller
{
    /**
     * エリア一覧を取得
     */
    public function index()
    {
        return AreaResource::collection(Area::all());
    }
}