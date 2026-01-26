<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * エラーメッセージの日本語化
     */
    public function messages(): array
    {
        return [
            'email.required' => ':attributeを入力してください。',
            'email.email' => ':attributeの形式が正しくありません。',
            'password.required' => ':attributeを入力してください。',
        ];
    }

    /**
     * 項目名の日本語化
     */
    public function attributes(): array
    {
        return [
            'email' => 'メールアドレス',
            'password' => 'パスワード',
        ];
    }
}