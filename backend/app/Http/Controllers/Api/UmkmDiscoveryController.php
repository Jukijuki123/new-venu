<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UmkmProfileResource;
use App\Http\Traits\ApiResponse;
use App\Models\UmkmProfile;
use Illuminate\Http\Request;

class UmkmDiscoveryController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = UmkmProfile::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('location')) {
            $query->where(
                'location',
                'like',
                "%{$request->location}%"
            );
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where(
                    'business_name',
                    'like',
                    "%{$request->search}%"
                )->orWhere(
                    'products',
                    'like',
                    "%{$request->search}%"
                );
            });
        }

        $query->latest('id');

        if ($request->filled('limit')) {
            $limit = min(
                max((int) $request->limit, 1),
                12
            );

            $umkms = $query
                ->limit($limit)
                ->get();

            return $this->success(
                'Daftar UMKM.',
                UmkmProfileResource::collection($umkms)
            );
        }

        $umkms = $query->paginate(12);

        return $this->success(
            'Daftar UMKM.',
            UmkmProfileResource::collection($umkms)
                ->response()
                ->getData(true)
        );
    }
}