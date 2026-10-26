<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SchoolFactory extends Factory
{
    public function definition(): array
    {
        $names = [
            'SMKN 26 Jakarta',
            'SMKN 46 Jakarta',
            'SMKN 48 Jakarta',
            'SMKN 57 Jakarta',
            'SMKN 6 Jakarta',
        ];

        return [
            'user_id' => User::factory()->state(['role' => 'school']),
            'school_name' => fake()->randomElement($names),
            'npsn' => fake()->numerify('########'),
            'position' => fake()->randomElement(['Kepala Sekolah', 'Wakasek Kesiswaan', 'Pembina OSIS']),
            'description' => fake()->randomElement([
                'Sekolah menengah kejuruan dengan program kewirausahaan aktif.',
                'Rutin mengadakan event tahunan untuk mendukung UMKM lokal.',
                'Berfokus pada pengembangan bakat siswa di bidang bisnis dan kreativitas.',
            ]),
            'address' => fake()->address(),
            'phone' => fake()->numerify('08##########'),
        ];
    }
}
