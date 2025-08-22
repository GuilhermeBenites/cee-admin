<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'transaction_date' => ['required', 'date'],
            'payment_method' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.category_id' => ['required', 'integer', 'exists:categories,id'],
            'items.*.item_amount' => ['required', 'numeric', 'min:0.01'],
            'items.*.item_description' => ['nullable', 'string'],
            'items.*.member_id' => ['nullable', 'integer', 'exists:members,id'],
            'items.*.reference_months' => ['nullable', 'string'],
        ];
    }
}
