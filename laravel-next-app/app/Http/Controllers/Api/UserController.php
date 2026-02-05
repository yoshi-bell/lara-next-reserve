<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * ログイン中のユーザー情報を取得
     */
    public function show(Request $request): UserResource
    {
        return new UserResource($request->user());
    }
}
