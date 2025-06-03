<?php

namespace Tests\Unit\Services;

use App\Services\TrailerService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class TrailerServiceTest extends TestCase
{
    protected TrailerService $trailerService;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.youtube.key', 'test-api-key');
        $this->trailerService = new TrailerService();
    }

    public function test_successful_trailer_search_returns_embed_url()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['videoId' => 'test123'],
                        'snippet' => ['title' => 'Test Movie Trailer']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertEquals('https://www.youtube.com/embed/test123', $result);
    }

    public function test_empty_title_string()
    {
        Http::fake([
            '*' => Http::response(['items' => []])
        ]);

        $result = $this->trailerService->searchTrailers('');

        $this->assertNull($result);
    }

    public function test_whitespace_only_title()
    {
        Http::fake([
            '*' => Http::response(['items' => []])
        ]);

        $result = $this->trailerService->searchTrailers('   ');

        $this->assertNull($result);
    }

    public function test_extremely_long_title()
    {
        $longTitle = str_repeat('A', 10000);

        Http::fake([
            '*' => Http::response(['items' => []])
        ]);

        $result = $this->trailerService->searchTrailers($longTitle);

        $this->assertNull($result);
    }

    public function test_title_with_special_characters()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['videoId' => 'special123'],
                        'snippet' => ['title' => 'Special Movie']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('Movie!@#$%^&*()');

        $this->assertEquals('https://www.youtube.com/embed/special123', $result);
    }

    public function test_title_with_unicode_characters()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['videoId' => 'unicode123'],
                        'snippet' => ['title' => 'Unicode Movie']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('电影 🎬 Película');

        $this->assertEquals('https://www.youtube.com/embed/unicode123', $result);
    }

    public function test_api_returns_http_error_status()
    {
        Http::fake([
            '*' => Http::response([], 500)
        ]);

        Log::shouldReceive('error')
            ->once()
            ->with('YouTube API request failed', [
                'title' => 'Test Movie',
                'status' => 500,
            ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertNull($result);
    }

    public function test_api_returns_empty_items_array()
    {
        Http::fake([
            '*' => Http::response(['items' => []])
        ]);

        $result = $this->trailerService->searchTrailers('Nonexistent Movie');

        $this->assertNull($result);
    }

    public function test_api_returns_null_items()
    {
        Http::fake([
            '*' => Http::response(['items' => null])
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertNull($result);
    }

    public function test_api_returns_items_without_id_field()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'snippet' => ['title' => 'Test Movie Trailer']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertNull($result);
    }

    public function test_api_returns_id_without_video_id()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['channelId' => 'someChannel'],
                        'snippet' => ['title' => 'Test Movie Trailer']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertNull($result);
    }

    public function test_api_returns_empty_video_id()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['videoId' => ''],
                        'snippet' => ['title' => 'Test Movie Trailer']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertNull($result);
    }

    public function test_api_returns_null_video_id()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['videoId' => null],
                        'snippet' => ['title' => 'Test Movie Trailer']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertNull($result);
    }

    public function test_api_returns_malformed_json()
    {
        Http::fake([
            '*' => Http::response('malformed json', 200)
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertNull($result);
    }

    public function test_http_exception_is_caught_and_logged()
    {
        Http::fake(function () {
            throw new \Exception('Network error');
        });

        Log::shouldReceive('error')
            ->once()
            ->with('Error fetching trailer link: Network error', ['title' => 'Test Movie']);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertNull($result);
    }

    public function test_video_id_with_special_characters()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['videoId' => 'abc-123_XYZ'],
                        'snippet' => ['title' => 'Test Movie Trailer']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertEquals('https://www.youtube.com/embed/abc-123_XYZ', $result);
    }

    public function test_title_with_leading_and_trailing_whitespace()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['videoId' => 'trimmed123'],
                        'snippet' => ['title' => 'Test Movie Trailer']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('  Test Movie  ');

        Http::assertSent(function ($request) {
            return $request->data()['q'] === 'Test Movie trailer';
        });

        $this->assertEquals('https://www.youtube.com/embed/trimmed123', $result);
    }

    public function test_multiple_items_returns_first_video_id()
    {
        Http::fake([
            '*' => Http::response([
                'items' => [
                    [
                        'id' => ['videoId' => 'first123'],
                        'snippet' => ['title' => 'First Trailer']
                    ],
                    [
                        'id' => ['videoId' => 'second456'],
                        'snippet' => ['title' => 'Second Trailer']
                    ]
                ]
            ])
        ]);

        $result = $this->trailerService->searchTrailers('Test Movie');

        $this->assertEquals('https://www.youtube.com/embed/first123', $result);
    }
}
