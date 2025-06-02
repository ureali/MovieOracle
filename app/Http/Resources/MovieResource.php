<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovieResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'imdb_id'             => $this->imdb_id,
            'title'               => $this->title,
            'year'                => $this->year,
            'poster'              => $this->poster,
            'synopsis'            => $this->synopsis,
            'where_to_watch_url'  => $this->where_to_watch_url,
            'youtube_trailer_url' => $this->youtube_trailer_url,
            'director'            => $this->director,
            'ratings'              => $this->ratings,
            'genres'              => $this->genres,
        ];
    }
}
