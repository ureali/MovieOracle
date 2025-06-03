<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'imdb_id',
        'title',
        'poster',
        'year',
        'synopsis',
        'where_to_watch_url',
        'youtube_trailer_url',
        'director',
        'ratings',
        'genres',
    ];

    // it's ratingS not rating
    protected $casts = [
        'ratings' => 'array',
    ];
}
