<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Match LLM Enabled
    |--------------------------------------------------------------------------
    |
    | Saat diatur true, sistem akan mencoba menghasilkan alasan kecocokan
    | match_reason_ai melalui LLM (Gemini). Fitur ini memerlukan biaya API.
    | Saat false, hanya match_reason (deterministik/rule-based) yang diisi,
    | dan match_reason_ai akan tetap NULL (gratis).
    |
    */

    'llm_enabled' => env('AI_MATCH_LLM_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | LLM Provider
    |--------------------------------------------------------------------------
    |
    | Provider LLM yang digunakan. Saat ini mendukung 'gemini'.
    |
    */

    'llm_provider' => env('AI_MATCH_LLM_PROVIDER', 'gemini'),

    /*
    |--------------------------------------------------------------------------
    | Gemini API Key
    |--------------------------------------------------------------------------
    |
    | Hanya diperlukan jika llm_enabled = true.
    |
    */

    'gemini_api_key' => env('GEMINI_API_KEY'),

];
