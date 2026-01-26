<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; color: #333; }
        .container { padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { font-size: 1.2em; font-weight: bold; margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        .footer { font-size: 0.9em; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">予約完了のお知らせ</div>
        
        <p>{{ $reservation->user->name }}様</p>

        <p>飲食店予約サービス「Rese」をご利用いただきありがとうございます。<br>
        以下の内容でご予約を承りました。</p>

        <div class="details">
            <strong>店舗名:</strong> {{ $reservation->shop->name }}<br>
            <strong>日時:</strong> {{ $reservation->start_at->format('Y年m月d日 H:i') }}<br>
            <strong>人数:</strong> {{ $reservation->number }}名様
        </div>

        <p>当日のご来店を心よりお待ちしております。</p>

        <div class="footer">
            ※本メールは送信専用です。心当たりがない場合は破棄してください。
        </div>
    </div>
</body>
</html>
