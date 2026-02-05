<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

use App\Http\Resources\GenreResource;

class GenreController extends Controller
{
    /**
     * ジャンル一覧を取得
     */
    public function index()
    {
        return GenreResource::collection(Genre::all());
    }
}