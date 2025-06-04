<?php

namespace App\Services;

use App\Models\DailyApiCount;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB; // Ensure DB facade is imported

class ApiUsageTrackerService
{
    /**
     * Records an API call for the given service.
     * Atomically inserts a new record with count 1 or increments the existing count.
     */
    public function recordCall(string $serviceName): void
    {
        $today = Carbon::today();

        DailyApiCount::upsert(
            [
                // Values to insert if the record is new
                [
                    'service_name' => $serviceName,
                    'date' => $today->toDateString(), // Use toDateString for 'date' column type
                    'count' => 1,                     // Initial count for a new record
                    // 'created_at' and 'updated_at' will be handled automatically by Eloquent
                    // for new records if your model uses HasTimestamps (which base Model does).
                ]
            ],
            ['service_name', 'date'], // Columns to check for conflict (unique constraint)
            [
                // Columns to update if a conflict occurs (record already exists)
                'count' => DB::raw('daily_api_counts.count + 1'), // Atomically increment count
                // 'updated_at' will also be handled automatically by Eloquent on update.
            ]
        );
    }

    /**
     * Gets today's API call count for a specific service.
     */
    public function getTodaysCount(string $serviceName): int
    {
        $today = Carbon::today();
        $record = DailyApiCount::where('service_name', $serviceName)
            ->where('date', $today->toDateString()) // Use toDateString for consistency
            ->first();

        return $record ? $record->count : 0;
    }

    /**
     * Gets API usage data for a service within a date range.
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUsageForDateRange(string $serviceName, Carbon $startDate, Carbon $endDate)
    {
        return DailyApiCount::where('service_name', $serviceName)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->orderBy('date', 'asc')
            ->get();
    }
}
