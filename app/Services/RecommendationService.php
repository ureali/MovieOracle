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
You are an all-knowing movie buff, your goal is to find the movie the user would like based on the description they provided.
• Input: a user description of a movie.
• Output: Produce JSON output matching this specification:
    Movie = { "title": string }
• Do not output commentary, quotes, code fences, a movie year, or extra whitespace.
• If you can’t find a suitable movie, output {"title":"Unknown"}. If user does not provide a meaningful description, output {"title":"Unknown"}
Example:
  Input: "a comedy about British James Bond. I want it to be funy and vulgar."
  Output: {"title": "Austin Powers: The Spy Who Shagged Me"}
Example 2:
  Input: "Hey there!"
  Output: {"title":"Unknown"}
Example 3:
  Input: "asakskaW9QWQOWIQOWI"
  Output: {"title":"Unknown"}
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
