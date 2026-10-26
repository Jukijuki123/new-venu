<?php

// database/factories/EventFactory.php
namespace Database\Factories;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EventFactory extends Factory
{
    private static array $eventNames = [
        'Festival Budaya', 'Market Day', 'Expo Karya Siswa', 'Bazar Kewirausahaan',
        'Pekan Kuliner Sekolah', 'Pameran UMKM Sekolah', 'Bazar Ramadhan',
    ];

    private static array $descriptionsByAudience = [
        'Pelajar' => 'Event ini dirancang khusus untuk menyasar pengunjung pelajar dari berbagai sekolah di sekitar lokasi.',
        'Umum' => 'Terbuka untuk umum, event ini menyasar pengunjung dari berbagai kalangan masyarakat sekitar.',
        'Keluarga' => 'Suasana event ini ramah untuk keluarga, cocok dikunjungi bersama orang tua dan anak.',
        'Remaja' => 'Event ini mengusung konsep anak muda, menyasar pengunjung remaja dan komunitas kreatif.',
    ];

    public function definition(): array
    {
        $categories = ['Makanan', 'Minuman', 'Kerajinan', 'Aksesoris', 'Fashion'];
        $locations = ['Jakarta Timur', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Pusat', 'Jakarta Utara'];
        $audience = fake()->randomElement(array_keys(self::$descriptionsByAudience));
        $cat = fake()->randomElement($categories);

        $name = fake()->randomElement(self::$eventNames) . ' ' . fake()->year();

        return [
            'school_id' => School::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 9999),
            'description' => self::$descriptionsByAudience[$audience],
            'category' => $cat,
            'categories' => [$cat],
            'event_date' => fake()->dateTimeBetween('+1 week', '+2 months'),
            'location' => fake()->randomElement($locations),
            'target_audience' => $audience,
            'target_visitors' => fake()->numberBetween(200, 1000),
            'booth_capacity' => fake()->numberBetween(10, 30),
            'booth_price' => fake()->randomElement([300000, 400000, 450000, 500000]),
            'status' => 'published',
        ];
    }
}
