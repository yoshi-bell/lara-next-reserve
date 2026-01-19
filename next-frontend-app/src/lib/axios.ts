// src/lib/axios.ts
import Axios from 'axios';
import Cookies from 'js-cookie'; // js-cookieをインポート

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // これが重要（クッキーを常に送信）
});

// リクエストインターセプターを追加
axios.interceptors.request.use(config => {
    const token = Cookies.get('XSRF-TOKEN');
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
});

export default axios;
