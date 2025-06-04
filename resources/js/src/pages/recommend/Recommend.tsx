import fetchImdbIds from "@/services/fetchImdbIds.ts";
import {useQuery} from "@tanstack/react-query";
import {Link, useNavigate, useRouterState} from "@tanstack/react-router";
import "./Recommend.css"
import {useEffect} from "react";
import Loading from "@/components/Loading/Loading.tsx";
import Error from "../../components/Error/Error"

export default function Recommend() {
    // works fine idk
    const { query } = useRouterState({select: s => s.location.state});
    const navigate = useNavigate();

    useEffect(() => {
        if (query == undefined) return

        if (!query) {
            navigate({to: "/", replace: false});
        }
    }, [query, navigate]);



    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["movies", query],
        queryFn: () => (query ? fetchImdbIds(query) : Promise.resolve(null)),
        enabled: !!query,
        retry: false
    });


    useEffect(() => {
        if (data) {
            navigate({to:`/movie/recommendations`, replace:true, search: {ids: data} });
        }
    }, [data, navigate]);

    if (!query) {
        return (
            <>
                <title>Finding Recommendations – Suggest a Flick</title>
                <meta
                    name="description"
                    content="Fetching personalized movie recommendations based on your query. Redirecting to your results."
                />
                <meta
                    name="keywords"
                    content="movie recommendations, AI movie search, Suggest a Flick"
                />
                <div className="text-center p-4">
                    Our Oracle needs description to find find the movie of your dream! Try again, make sure to type it
                    out.
                </div>
                <Link to="/" search={{}}>
                    Home
                </Link>
            </>
        );
    }


    if (isLoading || isFetching) {
        return <Loading/>
    }

    if (isError || !data) {
        return <Error/>
    }


    return null;
}
