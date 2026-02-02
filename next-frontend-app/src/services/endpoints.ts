// src/services/endpoints.ts

export const ENDPOINTS = {
    SHOPS: {
        LIST: '/api/shops',
        DETAIL: (id: number | string) => `/api/shops/${id}`,
        // POST / DELETE 用
        FAVORITE: (shopId: number | string) => `/api/shops/${shopId}/favorite`,
    },
    RESERVATIONS: {
        LIST: '/api/reservations',
        CREATE: '/api/reservations',
        CANCEL: (id: number | string) => `/api/reservations/${id}`,
    },
    FAVORITES: {
        LIST: '/api/favorites', // お気に入り一覧取得用
    },
    AUTH: {
        LOGIN: '/api/login',
        LOGOUT: '/api/logout',
        REGISTER: '/api/register',
        USER: '/api/user',
        CSRF: '/sanctum/csrf-cookie',
    }
} as const;
