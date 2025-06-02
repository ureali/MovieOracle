import type Movie from "@/models/Movie.ts";

type PosterProps = {
    movie:Movie
    restrictSize?: boolean;
}

export default function MoviePoster({movie, restrictSize}:PosterProps) {
    // CODE SMELL ALERT
    // restrictSize doesn't indicate it, but it also changes w-fit to w-full.
    return (<div className={` relative ${restrictSize ? "w-full" : "w-fit"} mx-auto flex flex-row justify-center `}>
        <div className="bg-white p-4 border-solid w-full shadow-xl border-8 ">

            <img className={`block my-2 mx-auto w-fit ${restrictSize ? "h-[375px]" : ""}`} src={movie.poster} alt={movie.title + " Poster"}/>
            <p className="text-center text-xl italic">{movie.year}</p>
        </div>

    </div>)
}

