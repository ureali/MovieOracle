<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ApiUsageTrackerService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ApiUsageController extends Controller
{
    private ApiUsageTrackerService $apiUsageTrackerService;

    public function __construct(ApiUsageTrackerService $apiUsageTrackerService)
    {
        $this->apiUsageTrackerService = $apiUsageTrackerService;
        // Optional: Add admin authentication middleware if you have one.
        // e.g., $this->middleware(['auth', 'admin']);
    }

    public function index()
    {
        $today = Carbon::today();
        $omdbLimit = config('services.omdb.limit', 1000); // Default to 1000 if not in config

        $omdbTodaysCount = $this->apiUsageTrackerService->getTodaysCount('omdb');
        $geminiTodaysCount = $this->apiUsageTrackerService->getTodaysCount('gemini');
        $youtubeTodaysCount = $this->apiUsageTrackerService->getTodaysCount('youtube');

        $omdbPercentage = $omdbLimit > 0 ? ($omdbTodaysCount / $omdbLimit) * 100 : 0;

        // Data for the last 7 days for OMDB (example)
        $endDateHistorical = Carbon::today();
        $startDateHistorical = Carbon::today()->subDays(6);
        $omdbHistorical = $this->apiUsageTrackerService->getUsageForDateRange('omdb', $startDateHistorical, $endDateHistorical);

        $omdbHistoricalChartData = $omdbHistorical->mapWithKeys(function ($item) {
            return [$item->date->format('M d') => $item->count]; // Format for chart labels
        });


        return view('admin.api_usage.index', [
            'omdbTodaysCount' => $omdbTodaysCount,
            'omdbLimit' => $omdbLimit,
            'omdbPercentage' => round($omdbPercentage, 2),
            'geminiTodaysCount' => $geminiTodaysCount,
            'youtubeTodaysCount' => $youtubeTodaysCount,
            'omdbHistoricalLabels' => $omdbHistoricalChartData->keys(),
            'omdbHistoricalValues' => $omdbHistoricalChartData->values(),
            'todayDateString' => $today->toDateString(),
        ]);
    }
}
