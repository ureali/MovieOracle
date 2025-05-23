<?php
namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecommendationService {
    protected string $aiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public function getRecommendations(string $prompt) {
        $api_key = config('services.gemini.key');
        try {
            // daring today, are we?
            $response = Http::acceptJson()->post("{$this->aiEndpoint}?key={$api_key}", [
                'system_instruction' => [
                    "parts" => [
                        // can I be hired as prompt engineer?
                        "text" => "You are a faithful movie assistant. You know all the movies and their plots. Your goal is to help user find the movie they want going by their description. Example: a comedy about British James Bond fighting a bald man and a dwarf. Output: Austin Powers: The Spy Who Shagged Me. YOU MUST answer only with the name of the movie, no other text.",
                    ]
                ],
                'contents' => [
                    "parts" => [
                        "text" => $prompt
                    ]
                ]
            ]);
            $response->throw();
            Log::info($response->body());
            return collect($response->json("candidates"))
                ->pluck('content.parts')
                ->flatten(1)
                ->pluck('text')
                ->first();
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return null;
        }

    }
}
