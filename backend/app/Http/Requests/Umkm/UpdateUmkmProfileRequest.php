<?php

namespace App\Http\Requests\Umkm;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUmkmProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'products' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'target_audience' => ['nullable', 'string', Rule::in(['pelajar', 'remaja', 'umum', 'keluarga'])],
            'price_min' => 'nullable|integer|min:0',
            'price_max' => 'nullable|integer|min:0|gte:price_min',
            'booth_budget_max' => 'nullable|integer|min:0',
            'description' => 'nullable|string|max:1000',
        ];
    }
}
