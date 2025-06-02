<?php

namespace App\Services;

use App\Models\Movie;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use function Symfony\Component\String\s;

class MovieService
{
    private TrailerService $trailerService;

    public function __construct(\App\Services\TrailerService $trailerService)
    {
        $this->trailerService = $trailerService;
    }


    private $whereToWatchProviderUrl = "https://www.justwatch.com/ca/";
    public function search($query)
    {
        return $this->fetchMovie($query, "t");
    }

    public function createByImdbId($imdbId)
    {
        $this->fetchMovie($imdbId, "i");
    }

    /***
     * @param $query string Query to searh
     * @param $param string  Search Parameter (as in i or t)
     * @return movie
     */
    public function fetchMovie(string $query, string $param)
    {
        try {
            $query = trim(preg_replace('/\s+/', ' ', $query));

            return Movie::where('title', 'ILIKE', "%$query%")->firstOr(function () use ($param, $query) {
                $api_key = config('services.omdb.key');
                $response = Http::get('https://www.omdbapi.com/', [
                    "$param"      => $query,
                    'apikey' => $api_key,
                ]);

                $title = $param == "t" ? $query : $response['Title'];
                $slug = Str::slug($title, '-');
                $type = $response->json()['Type'] === 'series' ? 'tv-show' : 'movie';
                Log::info("Omdb response status: {$response->status()}");
                return Movie::create([
                    'imdb_id'             => $response['imdbID']       ,
                    'title'               => $response['Title']        ,
                    'year'                => $response['Year']         ,
                    'poster'              => $response['Poster']       ,
                    'synopsis'            => $response['Plot']          ,
                    'where_to_watch_url'  => $this->whereToWatchProviderUrl . $type . "/" . $slug,
                    'youtube_trailer_url' => $this->trailerService->searchTrailers($query),
                    'director'            => $response['Director']      ,
                    'ratings'             => $response['Ratings']      ,
                    'genres'             => $response['Genre']      ,

                ]);
            });
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return null;
        }

    }
}
