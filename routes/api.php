<?php

use App\Http\Controllers\Api\MovieController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::post('recommend', [MovieController::class, 'recommend']);
});
