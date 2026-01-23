<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    /**
     * ジャンル一覧を取得
     */
    public function index()
    {
        return response()->json(Genre::all());
    }
}