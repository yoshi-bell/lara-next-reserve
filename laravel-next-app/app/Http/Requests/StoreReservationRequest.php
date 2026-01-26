<?php

namespace App\Http\Requests;

use App\Models\Reservation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreReservationRequest extends FormRequest
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
            'shop_id' => ['required', 'exists:shops,id'],
            'start_at' => [
                'required',
                'date',
                'after:now',
                function ($attribute, $value, $fail) {
                    $exists = Reservation::where('user_id', Auth::id())
                        ->where('start_at', $value)
                        ->exists();
                    
                    if ($exists) {
                        $fail('指定された時間には既に別の予約が入っています。');
                    }
                },
            ],
            'number' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * エラーメッセージの日本語化
     */
    public function messages(): array
    {
        return [
            'required' => ':attributeを選択・入力してください。',
            'exists' => '選択された店舗は存在しません。',
            'date' => ':attributeの形式が正しくありません。',
            'after' => ':attributeは現在時刻より後の時間を指定してください。',
            'integer' => ':attributeは数値で入力してください。',
            'min' => ':attributeは:min名以上で指定してください。',
        ];
    }

    /**
     * 項目名の日本語化
     */
    public function attributes(): array
    {
        return [
            'shop_id' => '店舗',
            'start_at' => '予約日時',
            'number' => '予約人数',
        ];
    }
}