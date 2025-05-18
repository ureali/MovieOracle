import { useState } from 'react';

export default function SearchBar() {
    const [query, setQuery]     = useState('');
    const [movie, setMovie]     = useState(null);
    const [error, setError]     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMovie(null);

        try {
            const res = await fetch(`/api/v1/movies?query=${encodeURIComponent(query)}`);
            if (!res.ok) {
                // You could inspect res.status to handle 404 vs 400 etc.
                throw new Error('Movie not found or API error');
            }
            const data = await res.json();
            if (data.Response === 'False') {
                // OMDB returns `{ Response: 'False', Error: 'Movie not found!' }`
                throw new Error(data.Error);
            }
            setMovie(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movie title…"
                    required
                />
                <button type="submit">Search</button>
            </form>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            {movie && (
                <div>
                    <h2>{movie.title} ({movie.year})</h2>
                    {movie.poster && movie.poster !== 'N/A' && (
                        <img
                            src={movie.poster}
                            alt={`${movie.title} poster`}
                            style={{ maxWidth: '200px', display: 'block', marginBottom: '1rem' }}
                        />
                    )}
                    <p>{movie.synopsis}</p>
                </div>
            )}
        </div>
    );
}
