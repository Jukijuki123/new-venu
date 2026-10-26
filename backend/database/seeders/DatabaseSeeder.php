<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\School;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Schools — 3 utama untuk variasi
        $schools = [];

        $u1 = User::firstOrCreate(
            ['email' => 'school@venu.test'],
            ['name' => 'Admin SMKN 26', 'password' => Hash::make('password'), 'role' => 'school']
        );
        $schools['smkn26'] = School::firstOrCreate(
            ['user_id' => $u1->id],
            ['school_name' => 'SMKN 26 Jakarta', 'npsn' => '123456', 'position' => 'Kepala Sekolah', 'address' => 'Jl. Balai Pustaka, Jakarta Timur', 'phone' => '081234567800']
        );

        $u2 = User::firstOrCreate(
            ['email' => 'smkn48@venu.test'],
            ['name' => 'Admin SMKN 48', 'password' => Hash::make('password'), 'role' => 'school']
        );
        $schools['smkn48'] = School::firstOrCreate(
            ['user_id' => $u2->id],
            ['school_name' => 'SMKN 48 Jakarta', 'npsn' => '654321', 'position' => 'Wakasek Kesiswaan', 'address' => 'Jl. Pinang Ranti, Jakarta Timur', 'phone' => '081234567801']
        );

        $u3 = User::firstOrCreate(
            ['email' => 'smkn46@venu.test'],
            ['name' => 'Admin SMKN 46', 'password' => Hash::make('password'), 'role' => 'school']
        );
        $schools['smkn46'] = School::firstOrCreate(
            ['user_id' => $u3->id],
            ['school_name' => 'SMKN 46 Jakarta', 'npsn' => '789012', 'position' => 'Pembina OSIS', 'address' => 'Jl. Pendidikan, Jakarta Barat', 'phone' => '081234567802']
        );

        // Events — variasi kategori/lokasi/target/price agar score spread
        Event::firstOrCreate(
            ['slug' => 'festival-budaya'],
            [
                'school_id' => $schools['smkn26']->id,
                'name' => 'Festival Budaya',
                'description' => 'Festival budaya dan kreativitas siswa yang menghadirkan bazar makanan, minuman, dan produk lokal untuk pelajar.',
                'category' => 'Makanan',
                'categories' => ['Makanan'],
                'event_date' => '2026-11-21',
                'location' => 'Jakarta Timur',
                'target_audience' => 'Pelajar',
                'target_visitors' => 500,
                'booth_capacity' => 24,
                'booth_price' => 450000,
                'status' => 'published',
            ]
        );

        Event::firstOrCreate(
            ['slug' => 'market-day'],
            [
                'school_id' => $schools['smkn48']->id,
                'name' => 'Market Day',
                'description' => 'Market Day siswa dengan fokus pada makanan dan minuman, terbuka untuk umum dan pelajar.',
                'category' => 'Makanan',
                'categories' => ['Makanan', 'Minuman'],
                'event_date' => '2026-11-23',
                'location' => 'Jakarta Timur',
                'target_audience' => 'Umum',
                'target_visitors' => 700,
                'booth_capacity' => 30,
                'booth_price' => 400000,
                'status' => 'published',
            ]
        );

        Event::firstOrCreate(
            ['slug' => 'expo-karya-siswa'],
            [
                'school_id' => $schools['smkn46']->id,
                'name' => 'Expo Karya Siswa',
                'description' => 'Expo karya siswa menampilkan kerajinan, aksesoris, dan fashion hasil karya pelajar untuk keluarga dan umum.',
                'category' => 'Kerajinan',
                'categories' => ['Kerajinan', 'Aksesoris', 'Fashion'],
                'event_date' => '2026-12-05',
                'location' => 'Jakarta Barat',
                'target_audience' => 'Keluarga',
                'target_visitors' => 400,
                'booth_capacity' => 20,
                'booth_price' => 300000,
                'status' => 'published',
            ]
        );

        Event::firstOrCreate(
            ['slug' => 'bazar-kewirausahaan'],
            [
                'school_id' => $schools['smkn46']->id,
                'name' => 'Bazar Kewirausahaan',
                'description' => 'Bazar kewirausahaan remaja dengan tenant fashion dan aksesoris kekinian.',
                'category' => 'Fashion',
                'categories' => ['Fashion', 'Aksesoris'],
                'event_date' => '2026-12-10',
                'location' => 'Jakarta Selatan',
                'target_audience' => 'Remaja',
                'target_visitors' => 600,
                'booth_capacity' => 16,
                'booth_price' => 600000,
                'status' => 'published',
            ]
        );

        // UMKMs — 9 wajib + variasi lokasi/budget untuk spread score
        $logos = [
            "Hotway's" => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
            'Teh Poci' => 'https://images.unsplash.com/photo-1544787219-7f47cc556763?w=400&q=80',
            'Kopi Jago' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
            'Dapur Ibu Kartini' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
            'Ayam Geprek Berkah' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
            'Soto Betawi Haji Darman' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
            'Nasi Uduk Bu Yuli' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
            'Kreasi Lokal' => 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80',
            'Bros Cantik Handmade' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
        ];
        $umkms = [
            ["Hotway's", "Makanan", 'Jakarta Timur', 'Pelajar', 15000, 45000, 500000, 'hotways@venu.test', 'Ayam crispy, ayam goreng, kentang, dan makanan cepat saji. Cocok untuk pelajar di festival budaya.'],
            ['Teh Poci', 'Minuman', 'Jakarta Timur', 'Pelajar', 5000, 20000, 500000, 'tehpoci@venu.test', 'Teh manis, teh lemon, teh original, dan minuman dingin segar untuk bazar sekolah.'],
            ['Kopi Jago', 'Minuman', 'Jakarta Timur', 'Remaja', 10000, 30000, 500000, 'kopijago@venu.test', 'Kopi susu, kopi hitam, minuman kekinian untuk remaja dan umum.'],
            ['Dapur Ibu Kartini', 'Makanan', 'Jakarta Barat', 'Keluarga', 15000, 50000, 350000, 'dapur@venu.test', 'Masakan rumahan, nasi kotak, dan kue tradisional untuk keluarga.'],
            ['Ayam Geprek Berkah', 'Makanan', 'Jakarta Selatan', 'Pelajar', 12000, 28000, 400000, 'geprek@venu.test', 'Ayam geprek pedas dengan sambal khas, favorit pelajar.'],
            ['Soto Betawi Haji Darman', 'Makanan', 'Jakarta Pusat', 'Umum', 20000, 45000, 450000, 'soto@venu.test', 'Soto Betawi autentik dengan kuah santan gurih untuk umum.'],
            ['Nasi Uduk Bu Yuli', 'Makanan', 'Jakarta Timur', 'Umum', 10000, 25000, 600000, 'nasiuduk@venu.test', 'Nasi uduk, ayam goreng, dan lauk pauk untuk umum dan pelajar.'],
            ['Kreasi Lokal', 'Kerajinan', 'Jakarta Timur', 'Pelajar', 20000, 100000, 500000, 'kreasidemo@venu.test', 'Kerajinan tangan, aksesoris, dan souvenir lokal modern untuk bazar sekolah.'],
            ['Bros Cantik Handmade', 'Aksesoris', 'Jakarta Selatan', 'Remaja', 15000, 75000, 300000, 'bros@venu.test', 'Bros handmade, gelang manik, dan aksesoris etnik untuk remaja.'],
        ];

        foreach ($umkms as [$name, $cat, $loc, $audience, $min, $max, $budget, $email, $desc]) {
            $u = User::firstOrCreate(
                ['email' => $email],
                ['name' => "Pemilik $name", 'password' => Hash::make('password'), 'role' => 'umkm']
            );
            UmkmProfile::firstOrCreate(
                ['user_id' => $u->id],
                [
                    'business_name' => $name,
                    'products' => $desc,
                    'description' => $desc,
                    'category' => $cat,
                    'location' => $loc,
                    'logo' => $logos[$name] ?? null,
                    'price_min' => $min,
                    'price_max' => $max,
                    'booth_budget_max' => $budget,
                    'target_audience' => $audience,
                ]
            );
        }

        // Tambahan random untuk volume jika belum ada
        if (UmkmProfile::count() < 15) {
            UmkmProfile::factory(6)->create();
        }
        if (Event::count() < 7) {
            Event::factory(3)->create();
        }
    }
}
