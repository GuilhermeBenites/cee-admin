<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['income', 'expense']),
            'source_destination' => fake()->randomElement([
                'parking', 'bazar', 'bookstore', 'membership',
                'donations', 'other_income',
            ]),
            'description' => fake()->sentence(),
            'amount' => fake()->randomFloat(2, 10, 5000),
            'transaction_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'payment_method' => fake()->randomElement(['cash', 'pix', 'debit_card', 'credit_card', 'bank_transfer', 'bill', 'other']),
            'user_id' => User::factory(),
            'member_id' => null,
            'reference_months' => fake()->optional()->monthName().'/'.fake()->year(),
            'vehicle_type' => fake()->optional()->randomElement(['car', 'motorcycle']),
        ];
    }
}
