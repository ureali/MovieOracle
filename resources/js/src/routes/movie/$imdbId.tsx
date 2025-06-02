import {createFileRoute} from "@tanstack/react-router";
import MoviePage from "@/pages/movie/MoviePage.tsx";
import fetchMovie from "@/services/fetchMovie.ts";

export const Route = createFileRoute("/movie/$imdbId")({
    loader: async ({params}) => {
        return fetchMovie(params.imdbId)
    },
    component: MoviePage,
})
