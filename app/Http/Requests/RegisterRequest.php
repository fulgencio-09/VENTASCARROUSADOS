<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $role = $this->input('role');

        return [
            'role' => ['required', Rule::in(['vendedor_particular', 'concesionario'])],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'document_type' => ['nullable', 'string', 'max:30'],
            'document_number' => ['nullable', 'string', 'max:50'],
            'phone' => ['required', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'address' => ['nullable', 'string', 'max:255'],

            'legal_name' => [Rule::requiredIf($role === 'concesionario'), 'nullable', 'string', 'max:200'],
            'commercial_name' => [Rule::requiredIf($role === 'concesionario'), 'nullable', 'string', 'max:150'],
            'nit' => [Rule::requiredIf($role === 'concesionario'), 'nullable', 'string', 'max:30', 'unique:dealers,nit'],
            'dealer_email' => ['nullable', 'email', 'max:150'],
            'dealer_phone' => ['nullable', 'string', 'max:30'],
            'dealer_whatsapp' => ['nullable', 'string', 'max:30'],
            'website' => ['nullable', 'string', 'url', 'max:255'],
            'dealer_city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'dealer_address' => ['nullable', 'string', 'max:255'],
        ];
    }
}
