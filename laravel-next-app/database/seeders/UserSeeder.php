<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'テストユーザー1',
                'email' => 'user01@test.mail',
                'email_verified_at' => Carbon::now(), // メール認証済みにする
                'password' => Hash::make('usertest'),
                'phone_number' => '09011111111',
                'gender' => '男性',
                'birthday' => '1990-01-01',
            ],
            [
                'name' => 'テストユーザー2',
                'email' => 'user02@test.mail',
                'email_verified_at' => Carbon::now(), // メール認証済みにする
                'password' => Hash::make('usertest'),
                'phone_number' => '09022222222',
                'gender' => '女性',
                'birthday' => '1995-05-05',
            ],
            [
                'name' => 'テストユーザー3',
                'email' => 'user03@test.mail',
                'email_verified_at' => Carbon::now(), // メール認証済みにする
                'password' => Hash::make('usertest'),
                'phone_number' => '09033333333',
                'gender' => 'その他',
                'birthday' => '2000-10-10',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}