<?php

namespace App\Http\Requests\School;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    // app/Http/Requests/School/StoreEventRequest.php
   public function rules(): array
{
    return [
        'name' => 'required|string|max:255',

        'description' => 'nullable|string',

        'category' => 'nullable|string|max:100',

        'categories' => 'nullable|array|min:1',

        'categories.*' => 'string|max:100',

        'event_date' => 'required|date|after_or_equal:today',

        'location' => 'required|string|max:255',

        'target_audience' => 'nullable|string|max:100',

        'target_visitors' => 'nullable|integer|min:0',

        'booth_capacity' => 'required|integer|min:1',

        'booth_price' => 'required|integer|min:0',
    ];
}
}
