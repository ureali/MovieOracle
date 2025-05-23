<?php

namespace App\Services;

use App\Models\Movie;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use function Symfony\Component\String\s;

class MovieService
{
    public function search($query)
    {
        try {
            $query = trim(preg_replace('/\s+/', ' ', $query));

            return Movie::where('title', 'ILIKE', "%$query%")->firstOr(function () use ($query) {
                $api_key = config('services.omdb.key');
                $response = Http::get('https://www.omdbapi.com/', [
                    't'      => $query,
                    'apikey' => $api_key,
                ]);
                return Movie::create([
                    'imdb_id' => $response->json()['imdbID'],
                    'title' => $response->json()['Title'],
                    'year' => $response->json()['Year'],
                    'poster' => $response->json()['Poster'],
                    'synopsis' => $response->json()['Plot']
                ]);
            });
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return null;
        }


    }
}
