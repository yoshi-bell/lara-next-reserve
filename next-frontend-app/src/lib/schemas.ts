import { z } from 'zod';
import { AreaId, GenreId, ShopId, ReservationId, UserId } from '@/types/brands';

// 基本的なモデルのスキーマ定義

// Area
export const areaSchema = z.object({
    id: z.number().transform(v => v as AreaId),
    name: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Genre
export const genreSchema = z.object({
    id: z.number().transform(v => v as GenreId),
    name: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Shop
export const shopSchema = z.object({
    id: z.number().transform(v => v as ShopId),
    name: z.string(),
    area_id: z.number().transform(v => v as AreaId),
    genre_id: z.number().transform(v => v as GenreId),
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
    id: z.number().transform(v => v as ReservationId),
    user_id: z.number().transform(v => v as UserId),
    shop_id: z.number().transform(v => v as ShopId),
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
    id: z.number().transform(v => v as UserId),
    name: z.string(),
    email: z.string().email(),
    email_verified_at: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// 推論された型のExport (Single Source of Truth)
export type Area = z.infer<typeof areaSchema>;
export type Genre = z.infer<typeof genreSchema>;
export type Shop = z.infer<typeof shopSchema>;
export type Reservation = z.infer<typeof reservationSchema>;
export type User = z.infer<typeof userSchema>;

// Search Params (URL Query)
export const searchParamsSchema = z.object({
    // IDは数字の文字列であることを保証する
    area_id: z.string().regex(/^\d+$/).optional(),
    genre_id: z.string().regex(/^\d+$/).optional(),
    name: z.string().optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
