import { z } from 'zod';

// 基本的なモデルのスキーマ定義

// Area
export const areaSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Genre
export const genreSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Shop
export const shopSchema = z.object({
    id: z.number(),
    name: z.string(),
    area_id: z.number(),
    genre_id: z.number(),
    description: z.string(),
    image_url: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    default_capacity: z.number(),
    default_stay_time: z.number(),
    
    // Relations (whenLoaded)
    area: areaSchema.optional(),
    genre: genreSchema.optional(),
    
    // Optional (withExists)
    favorites_exists: z.boolean().optional(),
    
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Reservation
export const reservationSchema = z.object({
    id: z.number(),
    user_id: z.number(),
    shop_id: z.number(),
    start_at: z.string(), // DateTime string
    number: z.number(),
    usage_time: z.number(),
    
    // Relations (whenLoaded)
    shop: shopSchema.optional(),
    
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// User (Auth)
export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    email_verified_at: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Search Params (URL Query)
export const searchParamsSchema = z.object({
    // IDは数字の文字列であることを保証する
    area_id: z.string().regex(/^\d+$/).optional(),
    genre_id: z.string().regex(/^\d+$/).optional(),
    name: z.string().optional(),
});