<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyApiCount extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_name',
        'date',
        'count',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
