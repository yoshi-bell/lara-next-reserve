<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    /**
     * エリア一覧を取得
     */
    public function index()
    {
        return response()->json(Area::all());
    }
}