<?php

namespace App\Http\Traits;

trait ApiResponse
{
    protected function success(string $message, mixed $data = [], int $code = 200)
    {
        return response()->json(['success' => true, 'message' => $message, 'data' => $data], $code);
    }

    protected function error(string $message, mixed $errors = [], int $code = 422)
    {
        return response()->json(['success' => false, 'message' => $message, 'errors' => $errors], $code);
    }
}
