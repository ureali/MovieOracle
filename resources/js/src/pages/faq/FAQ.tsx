export default function FAQ() {
    return (
        <main>
            <title>FAQ – Suggest a Flick</title>
            <meta
                name="description"
                content="Find answers to common questions about Suggest a Flick’s AI-powered movie recommendations: how to search, account requirements, accuracy, and more."
            />
            <meta
                name="keywords"
                content="Suggest a Flick FAQ, movie recommendations, AI movie search, how to use Suggest a Flick"
            />
            <h1 className="text-3xl font-semibold text-center mb-8">FAQ</h1>
            <div className="space-y-4">
                <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer text-xl font-medium">
                        How do I get a movie recommendation?
                    </summary>
                    <p className="mt-2 text-lg">
                        Just type a description (genre, year, mood, even a fragment of the plot!) into the search box
                        and
                        hit “Ask!”. The Oracle will scan thousands of titles and return the best match.
                    </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer text-xl font-medium">
                        What if I don't remember anything about the movie I want to find?
                    </summary>
                    <p className="mt-2 text-lg">
                        No worries. Describe any detail you recall (actors, setting, music, even a snippet of dialogue).
                        Oracle’s smart matching will find it for you. For instance, "I forgot, but there was a movie,
                        something about milkshake and pumpkin" matched to Pulp Fiction as the first result. Oracle tries
                        to find up to 5 movies, which increases the chances of match.
                    </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer text-xl font-medium">
                        Can I search for non‑English or obscure films?
                    </summary>
                    <p className="mt-2 text-lg">
                        Yes! Movie Oracle covers international cinema and even titles without English translations.
                        However, for
                        best results, try to avoid searching for movies with non-latin titles.
                    </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer text-xl font-medium">
                        Do I need an account or subscription?
                    </summary>
                    <p className="mt-2 text-lg">
                        Nope. Movie Oracle works anonymously and is completely free.
                    </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer text-xl font-medium">
                        How accurate are the recommendations?
                    </summary>
                    <p className="mt-2 text-lg">
                        Almost 100% spot-on. During my testing, at maximum it missed 1-2 aspects of the description if
                        it was hyper-specific.
                    </p>
                </details>
            </div>
        </main>
    )
}
