<?php

// app/Http/Controllers/Api/Umkm/ProfileController.php
namespace App\Http\Controllers\Api\Umkm;

use App\Http\Controllers\Controller;
use App\Http\Requests\Umkm\UpdateUmkmProfileRequest;
use App\Http\Traits\ApiResponse;

class ProfileController extends Controller
{
    use ApiResponse;

    public function show()
    {
        return $this->success('Profil UMKM.', auth()->user()->umkmProfile);
    }

    public function update(UpdateUmkmProfileRequest $request)
    {
        $profile = auth()->user()->umkmProfile;
        $profile->update($request->validated());

        return $this->success('Profil UMKM diperbarui.', $profile);
    }
}
