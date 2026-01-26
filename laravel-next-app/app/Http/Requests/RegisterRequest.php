<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'phone_number' => ['required', 'string', 'max:20'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'age' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * エラーメッセージの日本語化
     */
    public function messages(): array
    {
        return [
            'required' => ':attributeを入力してください。',
            'email' => ':attributeの形式が正しくありません。',
            'max' => ':attributeは:max文字以内で入力してください。',
            'min' => ':attributeは:min文字以上で入力してください。',
            'unique' => 'この:attributeは既に登録されています。',
            'in' => '選択された:attributeは無効です。',
            'integer' => ':attributeは数値で入力してください。',
        ];
    }

    /**
     * 項目名の日本語化
     */
    public function attributes(): array
    {
        return [
            'name' => 'お名前',
            'email' => 'メールアドレス',
            'password' => 'パスワード',
            'phone_number' => '電話番号',
            'gender' => '性別',
            'age' => '年齢',
        ];
    }
}