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
    image_url: "/images/shops/sushi.jpg",
    area: { name: "東京都" },
    genre: { name: "寿司" },
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
