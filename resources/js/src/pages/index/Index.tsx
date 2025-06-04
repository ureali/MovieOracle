import SearchBar from "@/components/searchBar/SearchBar.tsx";
import Marquee from "@/components/marquee/Marquee.tsx";
import Examples from "@/components/examples/Examples.tsx";
import nightSky from "@/../public/images/night-sky.jpg"
import oracle from "@/../public/images/oracle.png"
import HowToUseCard from "@/components/HowToUseCard/HowToUseCard.tsx";
import "./Index.css"

export default function Index() {
    return (
        <>
            <meta
                name="description"
                content="Discover curated movie recommendations with Suggest a Flick. Describe genre, mood, or plot fragments and get personalized picks in seconds."
            />
            <meta
                name="keywords"
                content="AI movie recommendations, personalized film picks, streaming suggestions, movie oracle, movie search"
            />
            <header className="w-full flex justify-center items-center relative">
                <img src={nightSky} alt="Night Sky"
                     className="block absolute top-0 left-0 w-full h-full -z-10"/>
                <Marquee title="Suggest a Flick"/>
            </header>
            <main className="text-center">
                <section className="w-full flex justify-center items-center relative pb-16 night-sky">
                    <img src={nightSky} alt="Night Sky" className="block absolute top-0 left-0 w-full h-full -z-10 "/>
                    <SearchBar/>
                </section>

                <section
                    className="flex flex-row max-lg:flex-col justify-between items-stretch w-2/3 max-2xl:w-3/4 max-xl:w-11/12 mx-auto mt-16">
                    <div className="flex flex-col justify-evenly">
                        <div>
                            <h1 className=" font-bold text-4xl mb-6">How to Use</h1>
                            <p className="text-lg">
                                Do you have nothing to watch? Do you want to find a movie similar to the one you like?
                                Or
                                maybe
                                you
                                forgot the name of the movie you watched long time ago?
                            </p>
                        </div>

                        <div className="flex flex-row justify-between mt-2">
                            <HowToUseCard step="1" title="Describe" description="Enter what you are looking for."
                                          icon="💬"/>
                            <HowToUseCard step="2" title="Search"
                                          description="Our resident movie oracle scans thousands of titles." icon="🔎"/>
                            <HowToUseCard step="3" title="Watch" description="Get a recommendation and enjoy!"
                                          icon="🍿"/>
                        </div>

                    </div>
                    <div>
                        <img src={oracle} alt="An orangutan in beret holding popcorn and movie tape"
                             className="max-h-full max-lg:w-1/2 max-lg:my-4 mx-auto object-contain"/>
                    </div>


                </section>
                <Examples/>
                <section className="mt-16 text-center w-2/3 mx-auto">
                    <h1 className="font-bold text-4xl mb-6">Tips and Tricks</h1>
                    <ul className="list-inside text-left text-xl max-w-7xl mx-auto">
                        <li className="mb-6 bg-white dark:bg-black rounded-xl shadow-md border-2 border-yellow-400 p-6 hover:shadow-lg hover:border-yellow-500 dark:border-primary dark:hover:border-red-500 transition-all duration-200 text-lg sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                            Describe the movie in details. Our movie oracle doesn't need much to find a good match,
                            but
                            try to provide at least 1-2 sentences.
                        </li>

                        <li className="mb-6 bg-white dark:bg-black rounded-xl shadow-md border-2 border-yellow-400 p-6 hover:shadow-lg hover:border-yellow-500  dark:border-primary dark:hover:border-red-500 transition-all duration-200 text-lg sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                            Use English for best result. While the oracle can suggest foreign movies, the support
                            for
                            non-English titles is limited.
                        </li>

                        <li className="bg-white dark:bg-black rounded-xl shadow-md border-2 border-yellow-400 p-6 hover:shadow-lg hover:border-yellow-500 dark:border-primary dark:hover:border-red-500 transition-all duration-200 text-lg sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                            The description can be anything, be creative! "I want a cool movie" would work worse
                            than "I
                            am a fan of Marvel and DC franchises. Could you suggest a superhero movie made by a
                            lesser-known
                            company?"
                        </li>
                    </ul>
                </section>
            </main>
        </>

    )
}
