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
                        "text" => <<<EOT
You are a movie‐title extractor.
• Input: a user description of a movie.
• Output: Produce JSON output matching this specification:
    Movie = { "title": string }
• Do not output commentary, quotes, code fences, or extra whitespace.
• If you can’t identify a movie, output {"title":"Unknown"}.
Example:
  Input: "a comedy about British James Bond fighting a bald man and a dwarf"
  Output: {"title": "Austin Powers: The Spy Who Shagged Me"}
EOT,
                    ]
                ],
                'contents' => [
                    "parts" => [
                        "text" => $prompt
                    ]
                ],
                'tools' => [
                    "google_search" => (object)[]
                ]
            ]);
            $response->throw();
            Log::info($response->body());
            return json_decode( preg_replace('/^```(?:json)?\s*|\s*```$/', '', collect($response->json("candidates"))
                ->pluck('content.parts')
                ->flatten(1)
                ->pluck('text')
                ->first()), true);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return null;
        }

    }
}
