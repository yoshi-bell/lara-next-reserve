import type { Meta, StoryObj } from '@storybook/nextjs';
import ShopCard from "./ShopCard";
import { ShopId, AreaId, GenreId } from '@/types';

const meta: Meta<typeof ShopCard> = {
    title: "Components/ShopCard",
    component: ShopCard,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShopCard>;

const mockShop = {
    id: 1 as ShopId,
    name: "仙人",
    area_id: 1 as AreaId,
    genre_id: 1 as GenreId,
    description: "テスト店舗です。", 
    image_url: "/images/shops/sushi.jpg",
    start_time: "17:00:00", 
    end_time: "23:00:00", 
    default_capacity: 10, 
    default_stay_time: 120, 
    area: { id: 1 as AreaId, name: "東京都" },
    genre: { id: 1 as GenreId, name: "寿司" },
    favorites_exists: false,
};

export const Default: Story = {
    args: {
        shop: mockShop,
    },
};

export const Favorited: Story = {
    args: {
        shop: {
            ...mockShop,
            favorites_exists: true,
        },
    },
};

export const LongName: Story = {
    args: {
        shop: {
            ...mockShop,
            name: "ものすごく長い名前のテスト店舗名レストラン プレミアム店",
        },
    },
};
