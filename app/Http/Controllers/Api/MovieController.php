<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MovieResource;
use App\Models\Movie;
use App\Services\MovieService;
use App\Services\RecommendationService;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    private MovieService $movieService;
    private RecommendationService $recommendationService;


    public function __construct(MovieService $movieService, RecommendationService $recommendationService)
    {
        $this->movieService = $movieService;
        $this->recommendationService = $recommendationService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $imdbId)
    {
        $movie = Movie::where('imdb_id', $imdbId)->first();

        if (!$movie) {
            $this->movieService->createByImdbId($imdbId);
            $movie = Movie::where('imdb_id', $imdbId)->firstOrFail();
        }

        return new MovieResource($movie);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Movie $movie)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Movie $movie)
    {
        //
    }

    public function recommend(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:512',
        ]);
        $query = $request->get('query');
        $recommendations = $this->recommendationService->getRecommendations($query);
        if (count($recommendations) == 1 && $recommendations[0] == "Unknown") {
            return response()->json([]);
        }

        if ($recommendations !== null) {
            $results = [];
            foreach ($recommendations as $recommendation) {
                $results[] = $this->movieService->search($recommendation);
            }

            if ($results !== null) {
                return response()->json(array_map(function ($movie) {return $movie->imdb_id;}, $results));
            }
        }

        return response()->json("Server Error", 500);
    }
}
