<?php

use App\Http\Controllers\Admin\ApiUsageController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes(['register' => false]);


Route::group(["middleware"=>"auth", "prefix"=>"admin", "name"=>"admin."], function () {
    Route::get('/api-usage', [ApiUsageController::class, 'index'])->name('api_usage.index');
});

Route::any('{all}', function () {
    return view('welcome');
})
    ->where(['all' => '.*']);

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
