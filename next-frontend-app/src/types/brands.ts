/**
 * Branded Types (Nominal Typing) ユーティリティ
 * プリミティブ型にブランド（タグ）を付与し、型安全なID等を実現する。
 */
export type Brand<K, T> = K & { readonly __brand: T };

// 各エンティティの専用ID型
export type UserId = Brand<number, "UserId">;
export type ShopId = Brand<number, "ShopId">;
export type AreaId = Brand<number, "AreaId">;
export type GenreId = Brand<number, "GenreId">;
export type ReservationId = Brand<number, "ReservationId">;
