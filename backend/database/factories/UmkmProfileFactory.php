<?php

// database/factories/UmkmProfileFactory.php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UmkmProfileFactory extends Factory
{
    private const LOGO_BY_CATEGORY = [
        'Makanan' => [
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
        ],
        'Minuman' => [
            'https://images.unsplash.com/photo-1544787219-7f47cc556763?w=400&q=80',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
            'https://images.unsplash.com/photo-1525385133512-3985c1d28d4a?w=400&q=80',
            'https://images.unsplash.com/photo-1510626176961-4b57d4fb594b?w=400&q=80',
        ],
        'Kerajinan' => [
            'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80',
            'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80',
            'https://images.unsplash.com/photo-1493106641515-6b563a1d82fe?w=400&q=80',
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
        ],
        'Aksesoris' => [
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
            'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80',
            'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80',
        ],
        'Fashion' => [
            'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80',
            'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
        ],
    ];

    private static array $namesByCategory = [
        'Makanan' => ['Dapur Ibu Kartini', 'Warung Sate Mak Ijah', 'Nasi Uduk Bu Yuli', 'Ayam Geprek Berkah', 'Bakso Mang Ujang', 'Soto Betawi Haji Darman'],
        'Minuman' => ['Es Teh Segernya', 'Kedai Kopi Anten', 'Jus Sehat Ceria', 'Teh Poci Ratu', 'Susu Jahe Hangat', 'Kopi Kenangan Kampus'],
        'Kerajinan' => ['Kreasi Rotan Nusantara', 'Anyaman Bambu Lestari', 'Tenun Ikat Timur', 'Kriya Kayu Jati', 'Kreasi Lokal'],
        'Aksesoris' => ['Aksesoris Cantik Kita', 'Gelang Manik Sari', 'Perhiasan Etnik Nusa', 'Bros Cantik Handmade', 'Kalung Kayu Alam'],
        'Fashion' => ['Butik Hijab Aisyah', 'Kaos Distro Lokal', 'Baju Batik Modern', 'Fashion Muslimah Zahra', 'Sneakers Lokal Karya'],
    ];

    private static array $descriptions = [
        'Menyajikan produk berkualitas dengan harga terjangkau untuk semua kalangan.',
        'Usaha rumahan yang sudah berjalan lebih dari 3 tahun dengan pelanggan setia.',
        'Fokus pada produk lokal dengan sentuhan modern dan kemasan menarik.',
        'Selalu menjaga kualitas dan kesegaran bahan baku setiap hari.',
        'Cocok untuk acara sekolah, bazar, maupun festival komunitas.',
    ];

    public function definition(): array
    {
        $category = fake()->randomElement(array_keys(self::$namesByCategory));
        $locations = ['Jakarta Timur', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Pusat', 'Jakarta Utara'];
        $audiences = ['Pelajar', 'Umum', 'Keluarga', 'Remaja'];

        $priceMin = fake()->randomElement([15000, 20000, 25000, 30000, 40000]);
        $pool = self::LOGO_BY_CATEGORY[$category] ?? self::LOGO_BY_CATEGORY['Makanan'];

        return [
            'user_id' => User::factory()->state(['role' => 'umkm']),

            'business_name' => fake()->randomElement(
                self::$namesByCategory[$category]
            ),

            'products' => fake()->sentence(6),

            'phone' => fake()->numerify('08##########'),

            'description' => fake()->randomElement(self::$descriptions),

            'category' => $category,

            'location' => fake()->randomElement($locations),

            'logo' => fake()->randomElement($pool),

            'price_min' => $priceMin,

            'price_max' => $priceMin + fake()->randomElement([
                15000,
                25000,
                35000,
            ]),

            'booth_budget_max' => fake()->randomElement([400000, 500000, 600000]),

            'target_audience' => fake()->randomElement($audiences),
        ];
    }
}
