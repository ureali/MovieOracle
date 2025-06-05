<?php

namespace Tests\Unit\Services;

use App\Services\ApiUsageTrackerService;
use App\Services\RecommendationService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Mockery;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class RecommendationServiceTest extends TestCase
{
    protected RecommendationService $service;
    private ApiUsageTrackerService $apiService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->apiService = Mockery::mock(ApiUsageTrackerService::class);
        $this->apiService
            ->shouldReceive('recordCall')
            ->with('gemini')
            ->andReturnNull();
        $this->service = new RecommendationService($this->apiService);

        Http::preventStrayRequests();
        Log::shouldReceive('info')->byDefault();
        Log::shouldReceive('warning')->byDefault();
        Log::shouldReceive('error')->byDefault();
    }

    public function test_llm_returns_malformed_json_with_extra_text()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Here are some recommendations: [{"title": "Movie1"}] Hope this helps!']
                            ]
                        ]
                    ]
                ]
            ])
        ]);

        $result = $this->service->getRecommendations('test');

        $this->assertEquals(['Unknown'], $result);
    }

    public function test_llm_returns_movies_with_special_characters()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => '[{"title": "Movie: The \"Sequel\""}, {"title": "Film & More"}, {"title": "Test\nWith\nNewlines"}]']
                            ]
                        ]
                    ]
                ]
            ])
        ]);

        $result = $this->service->getRecommendations('test');

        $this->assertEquals(['Movie: The "Sequel"', 'Film & More', "Test\nWith\nNewlines"], $result);
    }

    public function test_api_key_exposed_in_url_on_http_exception()
    {
        Config::set('services.gemini.key', 'bye-bye-wallet');

        Http::fake([
            '*' => Http::response('Rate limited', 429)
        ]);

        $result = $this->service->getRecommendations('test');

        $this->assertNull($result);
        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'bye-bye-wallet');
        });
    }

    public function test_gemini_unavailable()
    {
        Config::set('services.gemini.key', 'bye-bye-wallet');

        Http::fake([
            '*' => Http::response('Gemini Unavailable', 503)
        ]);

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Gemini unavailable');

        $result = $this->service->getRecommendations('test');


        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'bye-bye-wallet');
        });
    }

    public function test_llm_ignores_system_instructions_returns_wrong_format()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Movie1\nMovie2\nMovie3']
                            ]
                        ]
                    ]
                ]
            ])
        ]);

        $result = $this->service->getRecommendations('test');

        $this->assertEquals(['Unknown'], $result);
    }

    public function test_empty_response_from_api()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([])
        ]);

        $result = $this->service->getRecommendations('test');

        $this->assertEquals(['Unknown'], $result);
    }

    public function test_llm_returns_empty_titles()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => '[{"title": ""}, {"title": "   "}, {"title": "Valid Movie"}]']
                            ]
                        ]
                    ]
                ]
            ])
        ]);

        $result = $this->service->getRecommendations('test');

        $this->assertEquals(['', '   ', 'Valid Movie'], $result);
    }

    public function test_connection_timeout()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake(function () {
            throw new ConnectionException('Connection timeout after 30 seconds');
        });

        $result = $this->service->getRecommendations('test');

        $this->assertNull($result);
    }

    public function test_case_sensitive_unknown_detection()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => '[{"title": "Unknown Movie"}]']
                            ]
                        ]
                    ]
                ]
            ])
        ]);

        $result = $this->service->getRecommendations('gibberish input');

        $this->assertEquals(['Unknown Movie'], $result);
    }

    public function test_missing_candidates_array()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([
                'other_field' => 'value'
            ])
        ]);

        $result = $this->service->getRecommendations('test');

        $this->assertEquals(['Unknown'], $result);
    }

    public function test_llm_returns_non_string_titles()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => '[{"title": 123}, {"title": true}, {"title": null}]']
                            ]
                        ]
                    ]
                ]
            ])
        ]);

        $result = $this->service->getRecommendations('test');

        $this->assertEquals([123, true, null], $result);
    }

    public function test_huge_prompt_parameter()
    {
        Config::set('services.gemini.key', 'fake-key');

        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => '[{"title": "Test"}]']
                            ]
                        ]
                    ]
                ]
            ])
        ]);

        $hugePrompt = str_repeat('Find me movies about ', 10000) . 'action';

        $result = $this->service->getRecommendations($hugePrompt);

        $this->assertEquals(['Test'], $result);
        Http::assertSent(function ($request) {
            return strlen($request->body()) > 100000;
        });
    }
}
