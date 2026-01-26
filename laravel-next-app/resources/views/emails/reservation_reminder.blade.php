<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; color: #333; }
        .container { padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { font-size: 1.2em; font-weight: bold; margin-bottom: 20px; color: #d9534f; }
        .details { margin-bottom: 20px; }
        .footer { font-size: 0.9em; color: #777; }
        .qr-code { margin-top: 20px; text-align: center; } /* QRコード用プレースホルダー */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">ご予約のリマインダー</div>
        
        <p>{{ $reservation->user->name }}様</p>

        <p>飲食店予約サービス「Rese」をご利用いただきありがとうございます。<br>
        明日、以下の内容でご予約を承っております。ご来店をお待ちしております。</p>

        <div class="details">
            <strong>店舗名:</strong> {{ $reservation->shop->name }}<br>
            <strong>日時:</strong> {{ $reservation->start_at->format('Y年m月d日 H:i') }}<br>
            <strong>人数:</strong> {{ $reservation->number }}名様
        </div>

        <p>※ご予約の変更・キャンセルはマイページよりお願いいたします。</p>

        <div class="footer">
            ※本メールは送信専用です。心当たりがない場合は破棄してください。
        </div>
    </div>
</body>
</html>
