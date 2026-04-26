<?php

namespace Database\Seeders;

use App\Models\Configuration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Configuration::create([
            'id'=> 1,
            'nomSociete' => 'e-Tech Energie+',
            'ninea' => '012090841 - SN THS 2025 A 1705',
            'email' => 'etechenergieplus@gmail.com',
            'contact' => '+221 78 805 16 17 / +221 77 114 51 52 / +221 77 046 70 04',
            'phraseLegale' => 'sdfghjlkjs fkleyuih gyfguyiuhiuhiyf',
            'logo' => 'app\Amaana.jpg'
        ]);
    }
}
