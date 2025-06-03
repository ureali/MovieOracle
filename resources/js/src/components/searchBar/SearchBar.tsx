import "./SearchBar.css";
import { useNavigate } from "@tanstack/react-router";
import { type Ref, useRef, useState } from "react";

declare module '@tanstack/react-router' {
    interface HistoryState {
        query?: string | null;
    }
}

const filterOptionsDefinition = {
    mood: { label: 'Mood', options: ['', 'Scary', 'Happy', 'Sad', 'Funny', 'Romantic'] },
    genre: { label: 'Genre', options: ['', 'Adventure', 'Animation', 'Crime', 'Drama', 'Family', 'Romance', 'Musical', 'Horror', 'Comedy', 'Action'] },
    releaseDate: { label: 'Release date', options: ['', 'Last 5 years', 'Last 10 years', 'Last 20 years'] },
    ageRating: { label: 'Age rating', options: ['', 'R', 'PG', 'PG-13'] },
} as const;

type FilterCategoryKey = keyof typeof filterOptionsDefinition;

const filterDisplayOrder: FilterCategoryKey[] = ['mood', 'genre', 'releaseDate', 'ageRating'];

type SelectedFiltersState = Record<FilterCategoryKey, string>;

export default function SearchBar() {
    const navigate = useNavigate();
    const [isFocused, setFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const inputRef: Ref<HTMLTextAreaElement> = useRef(null);

    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersState>({
        mood: '',
        genre: '',
        releaseDate: '',
        ageRating: '',
    });

    const handleFilterChange = (category: FilterCategoryKey, value: string) => {
        setSelectedFilters(prev => ({ ...prev, [category]: value }));
    };

    function handleSubmit(form: FormData) {
        const baseQuery = String(form.get("query")).trim();
        const activeFilterParts: string[] = [];

        filterDisplayOrder.forEach(key => {
            if (selectedFilters[key] && filterOptionsDefinition[key]) {
                activeFilterParts.push(`${filterOptionsDefinition[key].label}: ${selectedFilters[key]}`);
            }
        });

        let finalQuery = baseQuery;
        if (activeFilterParts.length > 0) {
            // I'm literally appending filters to llm. Yes it's genius.
            const filtersString = `Filters: ${activeFilterParts.join(', ')}`;
            if (baseQuery) {
                finalQuery = `${baseQuery} ${filtersString}`;
            } else {
                finalQuery = filtersString;
            }
        }

        if (finalQuery === "") {
            return;
        }
        navigate({ to: "/recommend", state: { query: finalQuery } });
    }

    return (
        <>
            <form action={handleSubmit} className={"film-strip flex flex-col justify-center items-center w-fit mx-auto text-xl" + " " + (isFocused ? "focused-input" : "")}>
                <div
                    className="flex relative flex-col bg-white dark:bg-neutral-800 w-1/3 max-xl:w-1/2 max-lg:w-11/12 rounded-lg inset-shadow-sm/30 items-center"
                    onClick={(e) => {
                        if (inputRef.current && !(e.target as HTMLElement).closest('#filters-menu-container')) {
                            inputRef.current.focus();
                        }
                    }}
                >
                    <textarea
                        ref={inputRef}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onChange={(e) => setCharCount(e.target.textLength)}
                        rows={2}
                        className="resize-none w-full p-2 text-black dark:text-white bg-white dark:bg-neutral-800 rounded-t-lg"
                        name="query"
                        maxLength={512}
                        placeholder={"Describe a movie you'd like to see, and the Oracle will find it!"}
                    />
                    <div className="grid grid-cols-3 items-center w-full relative space-x-2 my-2 px-2 sm:px-0">
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="text-base col-1 w-fit ml-2 sm:text-xl outline-1 outline-gray-400 dark:outline-neutral-600 -outline-offset-4 transition-all hover:scale-105 shadow-md bg-gray-200 dark:bg-neutral-700 text-black dark:text-white px-3 sm:px-4 py-1 rounded"
                            aria-expanded={showFilters}
                            aria-controls="filters-menu-container"
                        >
                            {showFilters ? "Hide Filters" : "Filters"}
                        </button>
                        <button
                            type="submit"
                            className="text-base  mx-auto col-2 w-fit sm:text-xl outline-1 outline-movie-yellow -outline-offset-4 transition-all hover:scale-105 shadow-2xl bg-primary text-white px-3 sm:px-4 py-1 rounded"
                        >
                            Ask!
                        </button>
                        <div
                            className="absolute text-xs sm:text-sm bottom-2 right-2 text-gray-500 dark:text-neutral-400">
                            {charCount} / 512
                        </div>
                    </div>


                    {showFilters && (
                        <div
                            id="filters-menu-container"
                            className="w-full p-3 sm:p-4 border-t border-gray-300 dark:border-neutral-700 mt-1"
                        >
                            <h3 className="text-md sm:text-lg font-semibold mb-2 text-black dark:text-white">Filter by:</h3>
                            {filterDisplayOrder.map((key) => {
                                const category = filterOptionsDefinition[key];
                                return (
                                    <div key={key} className="mb-2">
                                        <label htmlFor={`filter-${key}`} className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                                            {category.label}
                                        </label>
                                        <select
                                            id={`filter-${key}`}
                                            name={`filter-${key}`}
                                            value={selectedFilters[key]}
                                            onChange={(e) => handleFilterChange(key, e.target.value)}
                                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-black dark:text-white"
                                        >
                                            {category.options.map((option) => (
                                                <option key={option} value={option}>
                                                    {option || `Any ${category.label}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </form>
        </>
    );
}
