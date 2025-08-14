<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::create([
            'name' => 'Mensalidade',
            'type' => 'income',
        ]);

        Category::create([
            'name' => 'Estacionamento',
            'type' => 'income',
        ]);

        Category::create([
            'name' => 'Bazar',
            'type' => 'income',
        ]);

        Category::create([
            'name' => 'Livraria',
            'type' => 'income',
        ]);

        Category::create([
            'name' => 'Doação Espontânea',
            'type' => 'income',
        ]);

        Category::create([
            'name' => 'Outros',
            'type' => 'income',
        ]);

        Category::create([
            'name' => 'Pagamento',
            'type' => 'expense',
        ]);
    }
}