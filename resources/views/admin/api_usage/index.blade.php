<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Usage Statistics</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; background-color: #f0f2f5; color: #333; display: flex; justify-content: center; padding-top: 20px;}
        .container { background-color: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 90%; max-width: 800px; }
        h1 { color: #1a202c; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top:0; }
        h2 { color: #2d3748; margin-top: 30px; margin-bottom:10px; }
        .usage-stat { margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; background-color: #f7fafc;}
        .usage-stat p { margin: 5px 0; font-size: 1rem; }
        .usage-stat strong { color: #4a5568; }
        .progress-bar-container { width: 100%; background-color: #e2e8f0; border-radius: 4px; margin-top: 8px; overflow: hidden; }
        .progress-bar { height: 22px; background-color: #48bb78; /* Green */ width: 0%; text-align: center; line-height: 22px; color: white; border-radius: 4px; transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out; font-weight: bold; font-size: 0.9em; }
        .progress-bar.warning { background-color: #ecc94b; /* Yellow */ }
        .progress-bar.danger { background-color: #f56565; /* Red */ }
        .api-section { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #cbd5e0; padding: 10px; text-align: left; }
        th { background-color: #edf2f7; font-weight: 600; }
        .chart-container { margin-top: 20px; padding:15px; border:1px solid #e2e8f0; border-radius: 6px;}
    </style>
    <!-- Include Chart.js from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<div class="container">
    <h1>API Usage Statistics ({{ $todayDateString }})</h1>

    <div class="api-section">
        <h2>OMDB API</h2>
        <div class="usage-stat">
            <p><strong>Today's Calls:</strong> {{ $omdbTodaysCount }} / {{ $omdbLimit }}</p>
            <div class="progress-bar-container">
                @php
                    $omdbBarClass = '';
                    if ($omdbPercentage >= 90) $omdbBarClass = 'danger';
                    elseif ($omdbPercentage >= 75) $omdbBarClass = 'warning';
                @endphp
                <div class="progress-bar {{ $omdbBarClass }}"
                     style="width: {{ min($omdbPercentage, 100) }}%;">
                    {{ $omdbPercentage }}%
                </div>
            </div>
            @if ($omdbPercentage >= 100)
                <p style="color: #c53030; font-weight: bold;">Daily limit reached/exceeded!</p>
            @elseif ($omdbPercentage >= 75)
                <p style="color: #b08c1b; font-weight: bold;">Approaching daily limit ({{ $omdbPercentage }}%)</p>
            @endif
        </div>
    </div>

    <div class="api-section">
        <h2>Gemini API</h2>
        <div class="usage-stat">
            <p><strong>Today's Calls:</strong> {{ $geminiTodaysCount }}</p>
            <p><em>Note: Daily limit for Gemini API not specified here.</em></p>
        </div>
    </div>

    <div class="api-section">
        <h2>YouTube API</h2>
        <div class="usage-stat">
            <p><strong>Today's Calls:</strong> {{ $youtubeTodaysCount }}</p>
            <p><em>Note: Daily limit for YouTube API not specified here.</em></p>
        </div>
    </div>

    <div class="api-section">
        <h2>OMDB Usage - Last 7 Days</h2>
        @if($omdbHistoricalLabels->isNotEmpty())
            <div class="chart-container">
                <canvas id="omdbHistoricalChart"></canvas>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Calls</th>
                </tr>
                </thead>
                <tbody>
                @foreach($omdbHistoricalLabels as $index => $date)
                    <tr>
                        <td>{{ $date }}</td>
                        <td>{{ $omdbHistoricalValues[$index] }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        @else
            <p>No historical data available for OMDB in the last 7 days.</p>
        @endif
    </div>
</div>

<script>
    @if($omdbHistoricalLabels->isNotEmpty())
    const ctxOmdb = document.getElementById('omdbHistoricalChart');
    new Chart(ctxOmdb, {
        type: 'bar', // or 'line'
        data: {
            labels: @json($omdbHistoricalLabels),
            datasets: [{
                label: 'OMDB Calls',
                data: @json($omdbHistoricalValues),
                backgroundColor: 'rgba(72, 187, 120, 0.6)', // #48bb78 with opacity
                borderColor: 'rgba(72, 187, 120, 1)',
                borderWidth: 1,
                tension: 0.1 // for line chart
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1 // Ensure y-axis shows whole numbers if counts are low
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true,
        }
    });
    @endif
</script>
</body>
</html>
