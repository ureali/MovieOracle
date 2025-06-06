import {Route} from "@/routes/movie/$imdbId.tsx";
import nightSky from "../../../public/images/night-sky.jpg";
import Marquee from "@/components/marquee/Marquee.tsx";
import "./MoviePage.css"
import {useRouter} from "@tanstack/react-router";
import MoviePoster from "@/components/MoviePoster/MoviePoster.tsx";
import OracleLink from "@/components/OracleLink/OracleLink.tsx";
import metacritic from "../../../public/images/ratings/metacritic.svg";
import imdb from "../../../public/images/ratings/IMDB.svg";
import tomatoes from "../../../public/images/ratings/Rotten_Tomatoes.svg";
export default function MoviePage() {
    const {...movie} = Route.useLoaderData()
    const { history } = useRouter()



    return (
        <main className="relative">
            <title>{`${movie.title} – Suggest a Flick`}</title>
            <meta
                name="description"
                content={`Discover details about "${movie.title}": synopsis, director, ratings, genres, where to watch, and trailer.`}
            />
            <meta
                name="keywords"
                content={`${movie.title}, movie details, watch ${movie.title}, ${movie.title} trailer`}
            />
            <header
                className="w-full flex flex-col-reverse justify-center items-center p-8 relative movie-night-sky ">
                {/* Yes it's a fake link. Tanstack doesnt have navigate back smh. */}
                <a href="#" onClick={() => history.go(-1)}
                   className=" absolute top-14 left-14 z-20 text-movie-yellow font-bold ring-2 ring-movie-yellow p-4 rounded-2xl text-3xl drop-shadow-[0_0_4px_rgba(255,255,0,0.8)] font-bangers tracking-widest hover:drop-shadow-[0_0_8px_rgba(255,255,0,1)] transition-all max-lg:static max-md:mb-12">⇦
                    Back</a>
                <img src={nightSky} alt="Night Sky" loading="lazy"
                     className="block absolute top-0 left-0 w-full h-full -z-[1]"/>
                <Marquee title={movie.title}/>
            </header>

            <section className="mx-auto max-w-screen-xl max-lg:max-w-11/12 my-3 px-4
                    grid gap-10 lg:grid-cols-3">
                <div>
                    <MoviePoster movie={movie}/>
                </div>

                <div className="lg:col-span-2 items space-y-12 justify-start">
                    {movie.director || movie.ratings || movie.genres ? (<section
                        className="rounded-xl border-b-4 border-b-movie-yellow
                    shadow-xl hover:-translate-y-1 transition
                    bg-white/5 backdrop-blur"
                    >
                        <h2 className="text-3xl font-bangers text-primary text-center py-4">
                            Details
                        </h2>
                        <div className="px-6 pb-6 text-lg flex flex-col justify-center items-center gap-4 space-y-2">

                            {movie.ratings ? (<ul className="flex gap-8">
                                {movie.ratings.map(({Source, Value}) => {
                                    const logos: Record<string, string> = {
                                        "Rotten Tomatoes": tomatoes,
                                        "Internet Movie Database": imdb,
                                        "Metacritic": metacritic,
                                    };

                                    return (
                                        <li key={Source} className="flex items-center gap-3">
                                            {logos[Source] && (
                                                <img
                                                    src={logos[Source]}
                                                    alt={`${Source} logo`}
                                                    className="h-6 w-6 object-contain"
                                                />
                                            )}
                                            <span>{Value}</span>
                                        </li>);
                                })}
                            </ul>) : ""}
                            {movie.director ? (<p>
                                <span className="font-bold">Director:</span> {movie.director}
                            </p>) : ""}
                            {movie.genres ? (<p>
                                <span className="font-bold">Genres:</span> {movie.genres}
                            </p>) : ""}
                        </div>
                    </section>) : ""}
                    <section className="rounded-xl border-b-4 border-b-movie-yellow
                        shadow-xl hover:-translate-y-1 transition
                        bg-white/5 backdrop-blur">
                        <h2 className="text-3xl font-bangers text-primary text-center py-4">Synopsis</h2>
                        <div className="px-6 pb-6 text-lg leading-relaxed">{movie.synopsis}</div>
                    </section>

                </div>
            </section>
            <section className="rounded-xl border-b-4 border-b-movie-yellow
                        shadow-xl hover:-translate-y-1 transition max-w-screen-xl max-lg:max-w-11/12 mx-auto mt-16
                        bg-white/5 backdrop-blur">
                <h2 className="text-3xl font-bangers text-primary text-center py-4">Where to Watch</h2>
                <div className="px-6 pb-6 text-lg leading-relaxed"><OracleLink
                    destination={movie.where_to_watch_url}
                    text="Click Here"
                    target="_blank"/></div>
            </section>

            {/* youtube data is genuinely crazy, burning through faster than GEMINI!!!*/}
            { movie.youtube_trailer_url ?
                (<section className="w-full mx-auto py-16 text-center space-y-6">
                <h2 className="text-4xl font-bangers text-primary">Trailer</h2>
                <div className="movie-theater-section max-w-screen-xl rounded-md py-6 mx-auto max-xl:w-full">
                    <div className="  mx-auto w-2/3 aspect-video
                  rounded-xl shadow-xl overflow-hidden">
                        <iframe
                            src={movie.youtube_trailer_url}
                            title={`${movie.title} trailer`}
                            loading="lazy"
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                </div>

            </section> ) : ""
            }
        </main>

    )
}
