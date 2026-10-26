<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\User;
use App\Models\UmkmProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role' => [
                'required',
                Rule::in(['school', 'umkm']),
            ],

            'email' => [
                'required',
                'email',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
            ],

            // Field School
            'school_name' => [
                'required_if:role,school',
                'nullable',
                'string',
                'max:255',
            ],

            'npsn' => [
                'nullable',
                'string',
                'max:255',
            ],

            'position' => [
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            // Field UMKM
            'business_name' => [
                'required_if:role,umkm',
                'nullable',
                'string',
                'max:255',
            ],

            'category' => [
                'required_if:role,umkm',
                'nullable',
                'string',
                'max:255',
            ],

            'products' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:255',
            ],

            'location' => [
                'nullable',
                'string',
                'max:255',
            ],

            'target_audience' => [
                'nullable',
                'string',
                Rule::in(['pelajar', 'remaja', 'umum', 'keluarga']),
            ],

            'price_min' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'price_max' => [
                'nullable',
                'integer',
                'min:0',
                'gte:price_min',
            ],

            'booth_budget_max' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['role'] === 'school'
                    ? $validated['school_name']
                    : $validated['business_name'],

                'email' => $validated['email'],

                'role' => $validated['role'],

                'password' => Hash::make($validated['password']),
            ]);

            /*
             * 2. Buat profile berdasarkan role
             */
            if ($validated['role'] === 'school') {
                School::create([
                    'user_id' => $user->id,
                    'school_name' => $validated['school_name'],
                    'npsn' => $validated['npsn'] ?? null,
                    'position' => $validated['position'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                ]);

            } else {
                UmkmProfile::create([
                    'user_id' => $user->id,
                    'business_name' => $validated['business_name'],
                    'category' => $validated['category'],
                    'products' => $validated['products'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                    'location' => $validated['location'] ?? null,
                    'target_audience' => $validated['target_audience'] ?? null,
                    'price_min' => $validated['price_min'] ?? null,
                    'price_max' => $validated['price_max'] ?? null,
                    'booth_budget_max' => $validated['booth_budget_max'] ?? null,
                    'description' => $validated['description'] ?? null,
                ]);
            }

            return $user;
        });

        /*
         * 3. Load relationship untuk response
         */
        if ($user->role === 'school') {
            $user->load('school');
        } else {
            $user->load('umkmProfile');
        }

        // Login ke web guard + regenerate session (cookie-based auth)
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        /*
         * 4. Response ke frontend (TANPA token - cookie-based auth)
         */
        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil.',
            'data' => [
                'user' => $user,
            ],
        ], 201);
    }


    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
            ],

            'password' => [
                'required',
                'string',
            ],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi salah.',
            ], 401);
        }

        // Load relationship untuk response
        if ($user->role === 'school') {
            $user->load('school');
        } else {
            $user->load('umkmProfile');
        }

        // Login ke web guard + regenerate session (cookie-based auth)
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'user' => $user,
            ],
        ]);
    }


    public function logout(Request $request): JsonResponse
    {
        // Invalidate session server-side (cookie-based auth)
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }


    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'school') {
            $user->load('school');
        } else {
            $user->load('umkmProfile');
        }

        return response()->json([
            'success' => true,
            'message' => 'Data user.',
            'data' => [
                'user' => $user,
            ],
        ]);
    }
}
