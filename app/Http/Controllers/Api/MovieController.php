<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
    public function show(Movie $movie)
    {
        //
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
        $query = $request->get('query');
        $recommendations = $this->recommendationService->getRecommendations($query);
        $results = $this->movieService->search($recommendations);
        return response()->json($results->imdb_id);
    }
}
