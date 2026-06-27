<?php

namespace Database\Seeders;

use App\Models\FraudAlert;
use App\Models\User;
use Illuminate\Database\Seeder;

class FraudAlertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        if ($users->isEmpty()) return;

        foreach (range(1, 5) as $i) {
            FraudAlert::factory()->create([
                'user_id' => $users->random()->id,
            ]);
        }
    }
}
