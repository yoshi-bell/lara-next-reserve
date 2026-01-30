import type { Meta, StoryObj } from '@storybook/nextjs';
import ReservationCard from "./ReservationCard";

const meta: Meta<typeof ReservationCard> = {
    title: "Components/ReservationCard",
    component: ReservationCard,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReservationCard>;

const mockReservation = {
    id: 1,
    shop_id: 1,
    start_at: "2026-02-18T19:00:00Z",
    number: 2,
    usage_time: 120,
    shop: {
        id: 1,
        name: "仙人",
        image_url: "/images/shops/sushi.jpg",
        area: { id: 1, name: "東京都" },
        genre: { id: 1, name: "寿司" },
    },
};

export const Future: Story = {
    args: {
        reservation: mockReservation,
        index: 0,
        isHistory: false,
        onCancel: (id: number) => alert(`Cancel clicked for ID: ${id}`),
    },
};

export const History: Story = {
    args: {
        reservation: mockReservation,
        isHistory: true,
    },
};

export const MultiLineShopName: Story = {
    args: {
        reservation: {
            ...mockReservation,
            shop: {
                ...mockReservation.shop,
                name: "とても長い名前の高級本格江戸前寿司レストラン 本店",
            },
        },
        index: 9,
        isHistory: false,
    },
};
