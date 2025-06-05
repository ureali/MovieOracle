<?php

namespace Tests\Unit\Services;

use App\Services\ApiUsageTrackerService;
use Tests\TestCase;
use App\Services\MovieService;
use App\Services\TrailerService;
use App\Models\Movie;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Mockery;

class MovieServiceTest extends TestCase
{
    private $trailerService;
    private $movieService;
    private $apiService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->trailerService = Mockery::mock(TrailerService::class);
        $this->apiService = Mockery::mock(ApiUsageTrackerService::class);
        $this->movieService = new MovieService($this->trailerService, $this->apiService);
    }

    public function testFetchMovieWithSqlInjectionAttempt()
    {
        // bobby all grown up now
        $maliciousQuery = "'; DROP TABLE movies; --";
        Http::fake(['*' => Http::response(['Response' => 'False', 'Error' => 'Movie not found!'])]);

        $result = $this->movieService->fetchMovie($maliciousQuery, 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithXssPayload()
    {
        $xssQuery = "<script>alert('xss')</script>";
        Http::fake(['*' => Http::response(['Response' => 'False'])]);

        $result = $this->movieService->fetchMovie($xssQuery, 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithExtremelyLongString()
    {
        $longQuery = str_repeat('a', 100000);
        Http::fake(['*' => Http::response(['Response' => 'False'])]);

        $result = $this->movieService->fetchMovie($longQuery, 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithNullBytes()
    {
        $nullByteQuery = "movie\x00title";
        Http::fake(['*' => Http::response(['Response' => 'False'])]);

        $result = $this->movieService->fetchMovie($nullByteQuery, 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithUnicodeExploits()
    {
        $unicodeQuery = "movie\u202e\u0000\u200b";
        Http::fake(['*' => Http::response(['Response' => 'False'])]);

        $result = $this->movieService->fetchMovie($unicodeQuery, 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithInvalidParam()
    {
        Http::fake(['*' => Http::response(['Response' => 'False'])]);

        $result = $this->movieService->fetchMovie('test', 'x');

        $this->assertNull($result);
    }

    public function testFetchMovieWithMissingApiKey()
    {
        Config::set('services.omdb.key', null);
        Http::fake(['*' => Http::response(['Response' => 'False', 'Error' => 'No API key provided.'])]);

        $result = $this->movieService->fetchMovie('test', 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithMalformedApiResponse()
    {
        Http::fake(['*' => Http::response('invalid json response', 200)]);

        $result = $this->movieService->fetchMovie('test', 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithPartialApiResponse()
    {
        Http::fake(['*' => Http::response([
            'Title' => 'Test Movie',
            'imdbID' => null,
            'Year' => null
        ])]);

        $this->trailerService->shouldReceive('searchTrailers')->andReturn('');

        $result = $this->movieService->fetchMovie('test', 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithHttpTimeout()
    {
        Http::fake(['*' => function() {
            throw new \Illuminate\Http\Client\ConnectionException('Connection timeout');
        }]);

        $result = $this->movieService->fetchMovie('test', 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithTrailerServiceException()
    {
        Http::fake(['*' => Http::response([
            'Title' => 'Test Movie',
            'imdbID' => 'tt1234567',
            'Year' => '2020',
            'Poster' => 'poster.jpg',
            'Plot' => 'Test plot',
            'Director' => 'Test Director',
            'Ratings' => [],
            'Genre' => 'Action',
            'Type' => 'movie'
        ])]);

        $this->trailerService->shouldReceive('searchTrailers')
            ->andThrow(new \Exception('Trailer service failed'));

        $result = $this->movieService->fetchMovie('test', 't');

        $this->assertNull($result);
    }


    public function testFetchMovieWithDatabaseException()
    {
        Http::fake(['*' => Http::response([
            'Title' => 'Test Movie',
            'imdbID' => 'tt1234567',
            'Year' => '2020',
            'Poster' => 'poster.jpg',
            'Plot' => 'Test plot',
            'Director' => 'Test Director',
            'Ratings' => [],
            'Genre' => 'Action',
            'Type' => 'movie'
        ])]);

        $this->trailerService->shouldReceive('searchTrailers')->andReturn('');

        Mockery::mock(\Illuminate\Database\Eloquent\Builder::class)->shouldReceive('where->firstOr')->andThrow(new \Exception('Database error'));

        $result = $this->movieService->fetchMovie('test', 't');

        $this->assertNull($result);
    }

    public function testCreateByImdbIdReturnsVoid()
    {
        Http::fake(['*' => Http::response(['Response' => 'False'])]);

        $result = $this->movieService->createByImdbId('tt1234567');

        $this->assertNull($result);
    }

    public function testSearchWithEmptyString()
    {
        $result = $this->movieService->search('');

        $this->assertNull($result);
    }

    public function testSearchWithOnlyWhitespace()
    {
        Http::fake(['*' => Http::response(['Response' => 'False'])]);

        $result = $this->movieService->search('   ');

        $this->assertNull($result);
    }

    public function testFetchMovieWithInvalidImdbId()
    {
        Http::fake(['*' => Http::response(['Response' => 'False', 'Error' => 'Incorrect IMDb ID.'])]);

        $result = $this->movieService->fetchMovie('invalid-id', 'i');

        $this->assertNull($result);
    }

    public function testFetchMovieWithSpecialCharacters()
    {
        $specialQuery = "movie!@#$%^&*()_+-=[]{}|;':\",./<>?";
        Http::fake(['*' => Http::response(['Response' => 'False'])]);

        $result = $this->movieService->fetchMovie($specialQuery, 't');

        $this->assertNull($result);
    }

    public function testFetchMovieWithRateLimitResponse()
    {
        Http::fake(['*' => Http::response(['Response' => 'False', 'Error' => 'Request limit reached!'], 401)]);

        $result = $this->movieService->fetchMovie('test', 't');

        $this->assertNull($result);
    }



    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

}
