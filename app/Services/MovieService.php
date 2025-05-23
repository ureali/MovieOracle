<?php

namespace App\Services;

use App\Models\Movie;
use Illuminate\Support\Facades\Http;

class MovieService
{
    public function search($query)
    {
        $query = trim(preg_replace('/\s+/', ' ', $query));

        return Movie::where('title', 'ILIKE', "%$query%")->firstOr(function () use ($query) {
            $api_key = env('OMDB_KEY');
            $response = Http::get("http://www.omdbapi.com/?t={$query}&apikey={$api_key}");
            return Movie::create([
                'imdb_id' => $response->json()['imdbID'],
                'title' => $response->json()['Title'],
                'year' => $response->json()['Year'],
                'poster' => $response->json()['Poster'],
                'synopsis' => $response->json()['Plot']
            ]);
        });

    }
}
