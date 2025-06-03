<?php

namespace Database\Factories;

use App\Models\Movie;
use Illuminate\Database\Eloquent\Factories\Factory;

class MovieFactory extends Factory
{
    protected $model = Movie::class;

    public function definition()
    {
        return [
            'imdb_id'             => $this->faker->unique()->regexify('tt\d{7}'),
            'title'               => $this->faker->sentence(3),
            'poster'              => $this->faker->imageUrl(200, 300, 'movies'),
            'year'                => $this->faker->year(),
            'synopsis'            => $this->faker->paragraph(),
            'where_to_watch_url'  => $this->faker->url(),
            'youtube_trailer_url' => 'https://youtu.be/' . $this->faker->regexify('[A-Za-z0-9_-]{11}'),
            'director'            => $this->faker->name(),
            'ratings'             => [
                'imdb'           => $this->faker->randomFloat(1, 1, 10),
                'rottenTomatoes' => $this->faker->numberBetween(1, 100),
            ],
            'genres'              => implode(',', $this->faker->randomElements([
                'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller',
            ], 2)),
        ];
    }
}
