export default interface Movie {
    'imdb_id':string;
    'title':string;
    'year':string;
    'poster':string;
    'synopsis':string;
    'where_to_watch_url':string;
    'youtube_trailer_url':string;
    director: string;
    ratings: { Source: string, Value: string }[];
    genres: string;
}
