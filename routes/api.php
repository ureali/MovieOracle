<?php

use App\Http\Controllers\Api\MovieController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::get('movie/{imdbId}', [MovieController::class, 'show']);
    Route::post('recommend', [MovieController::class, 'recommend']);
});
