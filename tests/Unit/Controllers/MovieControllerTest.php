<?php

namespace Tests\Unit\Controllers;

use App\Models\Movie;
use App\Services\MovieService;
use App\Services\RecommendationService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class MovieControllerTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * Ensure Mockery expectations are verified and the container is reset.
     */
    protected function tearDown(): void
    {
        $this->app->forgetInstance(MovieService::class);
        $this->app->forgetInstance(RecommendationService::class);

        Mockery::close();
        parent::tearDown();
    }

    public function test_show_returns_existing_movie(): void
    {
        $movie = Movie::factory()->create(['imdb_id' => 'tt0111161']);


        $this->getJson("/api/v1/movie/{$movie->imdb_id}")
            ->assertOk()
            ->assertJsonPath('data.imdb_id', $movie->imdb_id);
    }

    public function test_show_creates_and_returns_movie_when_missing(): void
    {
        $movieService = Mockery::mock(MovieService::class);
        $movieService->shouldReceive('createByImdbId')
            ->once()
            ->with('tt0000001')
            ->andReturnUsing(fn () => Movie::factory()->create(['imdb_id' => 'tt0000001']));

        $this->instance(MovieService::class, $movieService);

        $this->getJson('/api/v1/movie/tt0000001')
            ->assertOk()
            ->assertJsonPath('data.imdb_id', 'tt0000001');
    }

    public function test_show_returns_404_for_invalid_id(): void
    {
        $movieService = Mockery::mock(MovieService::class)
            ->shouldReceive('createByImdbId')
            ->once()
            ->with('not_found')
            ->andReturnFalse()
            ->getMock();

        $this->instance(MovieService::class, $movieService);

        $this->getJson('/api/v1/movie/not_found')
            ->assertNotFound();
    }


    public function test_recommend_requires_valid_query(): void
    {
        $this->postJson('/api/v1/recommend', [])
            ->assertStatus(422);

        $this->postJson('/api/v1/recommend', ['query' => str_repeat('a', 1025)])
            ->assertStatus(422);
    }


    public function test_recommend_returns_empty_array_when_unknown(): void
    {
        $recService = Mockery::mock(RecommendationService::class)
            ->shouldReceive('getRecommendations')
            ->once()
            ->with('anything')
            ->andReturn(['Unknown'])
            ->getMock();

        $this->instance(RecommendationService::class, $recService);

        $this->postJson('/api/v1/recommend', ['query' => 'anything'])
            ->assertOk()
            ->assertExactJson([]);
    }

    public function test_recommend_resolves_and_returns_imdb_ids(): void
    {
        $recService = Mockery::mock(RecommendationService::class)
            ->shouldReceive('getRecommendations')
            ->once()
            ->with('matrix')
            ->andReturn(['The Matrix', 'John Wick'])
            ->getMock();
        $this->instance(RecommendationService::class, $recService);

        $movieService = Mockery::mock(MovieService::class);
        $movieService->shouldReceive('search')
            ->with('The Matrix')
            ->andReturn(Movie::factory()->create(['imdb_id' => 'tt0133093']));
        $movieService->shouldReceive('search')
            ->with('John Wick')
            ->andReturn(Movie::factory()->create(['imdb_id' => 'tt2911666']));
        $this->instance(MovieService::class, $movieService);

        $this->postJson('/api/v1/recommend', ['query' => 'matrix'])
            ->assertOk()
            ->assertExactJson(['tt0133093', 'tt2911666']);
    }

    public function test_recommend_returns_500_when_service_returns_null(): void
    {
        $recService = Mockery::mock(RecommendationService::class)
            ->shouldReceive('getRecommendations')
            ->once()
            ->with('fail')
            ->andReturnNull()
            ->getMock();
        $this->instance(RecommendationService::class, $recService);

        $this->postJson('/api/v1/recommend', ['query' => 'fail'])
            ->assertStatus(500);
    }
    public function test_recommend_returns_503_when_service_returns_unavailable(): void
    {
        $recService = Mockery::mock(RecommendationService::class)
            ->shouldReceive('getRecommendations')
            ->once()
            ->with('fail')
            ->andThrowExceptions([new HttpException(503, "Gemini unavailable" )])
            ->getMock();
        $this->instance(RecommendationService::class, $recService);

        $this->postJson('/api/v1/recommend', ['query' => 'fail'])
            ->assertStatus(503);
    }
}
