<?php

namespace App\Services;

use App\Models\Movie;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use function Symfony\Component\String\s;

class TrailerService
{
    protected string $baseUrl = 'https://www.googleapis.com/youtube/v3/search';

    protected string $apiKey;


    public function __construct()
    {
        $this->apiKey = config('services.youtube.key');
    }

    public function searchTrailers(string $title): ?string
    {
        $query = trim($title) . ' trailer';

        try {
            $response = Http::get($this->baseUrl, [
                'part' => 'snippet',
                'q' => $query,
                'type' => 'video',
                'maxResults' => 1,
                'key' => $this->apiKey,
            ]);

            if ($response->failed()) {
                Log::error('YouTube API request failed', [
                    'title' => $title,
                    'status' => $response->status(),
                ]);
                return null;
            }

            $items = $response->json('items', []);
            if (empty($items)) {
                return null;
            }

            $videoId = $items[0]['id']['videoId'] ?? null;
            if (!$videoId) {
                return null;
            }

            return 'https://www.youtube.com/embed/' . $videoId;
        } catch (\Exception $e) {
            Log::error('Error fetching trailer link: ' . $e->getMessage(), ['title' => $title]);
            return null;
        }
    }
}
