<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\Genre;
use App\Models\Shop;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 店舗一覧が取得できること
     */
    public function test_店舗一覧が取得できる(): void
    {
        Shop::factory()->count(3)->create();

        $response = $this->getJson('/api/shops');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    /**
     * エリアで絞り込みができること
     */
    public function test_エリアで絞り込みができる(): void
    {
        $area1 = Area::factory()->create(['name' => 'Tokyo']);
        $area2 = Area::factory()->create(['name' => 'Osaka']);

        Shop::factory()->create(['area_id' => $area1->id]);
        Shop::factory()->create(['area_id' => $area2->id]);
        Shop::factory()->create(['area_id' => $area2->id]);

        // area_id = 1 (Tokyo) で検索
        $response = $this->getJson('/api/shops?area_id=' . $area1->id);

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    /**
     * ジャンルで絞り込みができること
     */
    public function test_ジャンルで絞り込みができる(): void
    {
        $genre1 = Genre::factory()->create(['name' => 'Sushi']);
        $genre2 = Genre::factory()->create(['name' => 'Ramen']);

        Shop::factory()->create(['genre_id' => $genre1->id]);
        Shop::factory()->create(['genre_id' => $genre2->id]);

        // genre_id = 1 (Sushi) で検索
        $response = $this->getJson('/api/shops?genre_id=' . $genre1->id);

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    /**
     * 店名で部分一致検索ができること
     */
    public function test_店名で検索ができる(): void
    {
        Shop::factory()->create(['name' => 'Sushi Tarou']);
        Shop::factory()->create(['name' => 'Ramen Jiro']);
        Shop::factory()->create(['name' => 'Sushi Hanako']);

        // "Sushi" で検索
        $response = $this->getJson('/api/shops?name=Sushi');

        $response->assertStatus(200)
            ->assertJsonCount(2); // Tarou と Hanako がヒットするはず
    }

    /**
     * 店舗詳細が取得できること
     */
    public function test_店舗詳細が取得できる(): void
    {
        $shop = Shop::factory()->create([
            'name' => 'My Shop',
            'description' => 'Delicious food',
        ]);

        $response = $this->getJson('/api/shops/' . $shop->id);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $shop->id,
                'name' => 'My Shop',
                'description' => 'Delicious food',
            ]);
    }
}
