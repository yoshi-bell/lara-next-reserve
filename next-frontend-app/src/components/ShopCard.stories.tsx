import type { Meta, StoryObj } from '@storybook/nextjs';
import ShopCard from "./ShopCard";

const meta: Meta<typeof ShopCard> = {
    title: "Components/ShopCard",
    component: ShopCard,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShopCard>;

const mockShop = {
    id: 1,
    name: "仙人",
    area_id: 1, // Added
    genre_id: 1, // Added
    description: "テスト店舗です。", // Added
    image_url: "/images/shops/sushi.jpg",
    start_time: "17:00:00", // Added
    end_time: "23:00:00", // Added
    default_capacity: 10, // Added
    default_stay_time: 120, // Added
    area: { id: 1, name: "東京都" }, // id added
    genre: { id: 1, name: "寿司" }, // id added
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
