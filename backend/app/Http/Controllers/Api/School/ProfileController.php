<?php

// app/Http/Controllers/Api/School/ProfileController.php
namespace App\Http\Controllers\Api\School;

use App\Http\Controllers\Controller;
use App\Http\Requests\School\UpdateSchoolProfileRequest;
use App\Http\Traits\ApiResponse;

class ProfileController extends Controller
{
    use ApiResponse;

    public function show()
    {
        return $this->success('Profil sekolah.', auth()->user()->school);
    }

    public function update(UpdateSchoolProfileRequest $request)
    {
        $school = auth()->user()->school;
        $school->update($request->validated());

        return $this->success('Profil sekolah diperbarui.', $school);
    }
}
