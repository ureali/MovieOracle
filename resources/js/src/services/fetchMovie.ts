import type Movie from "@/models/Movie.ts";

export default async function fetchMovie(imdbId:string):Promise<Movie | undefined> {
    if (imdbId.trim() == "") {
        return;
    }

    const response = await fetch(`/api/v1/movie/${imdbId}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network response was not ok" }));
        throw new Error(errorData.message || "Failed to fetch movies");
    }

    const {data} = await response.json() as {data: Movie}
    return data;
}
