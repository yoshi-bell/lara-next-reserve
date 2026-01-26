<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest; // 追加
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function store(RegisterRequest $request) // 型変更
    {
        // バリデーションは自動実行されるため削除

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'gender' => $request->gender,
            'age' => $request->age,
        ]);

        event(new Registered($user));

        return response()->json($user, 201);
    }
}
