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
            'nomSociete' => 'test',
            'ninea' => 'qn-rdt-135',
            'rib' => 'fuiuhh 13578 hguhj ouyfty',
            'phraseLegale' => 'sdfghjlkjs fkleyuih gyfguyiuhiuhiyf',
            'logo' => 'app\Amaana.jpg'
        ]);
    }
}
