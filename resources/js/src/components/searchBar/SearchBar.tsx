import "./SearchBar.css"
import { useNavigate} from "@tanstack/react-router";
import {type Ref, useRef, useState} from "react";

declare module '@tanstack/react-router' {
    interface HistoryState {
        query?: string | null;
    }
}

export default function SearchBar() {
    const navigate = useNavigate();
    const [isFocused, setFocused] = useState(false);
    const inputRef:Ref<HTMLTextAreaElement> = useRef(null);


    function handleSubmit(form:FormData) {
        const query = String(form.get("query")).trim()
        if (query == "") {
            return;
        }

        navigate({to:"/recommend", state: { query: query }});

    }
    return (
        <>
            <form action={handleSubmit} className={"film-strip flex flex-col justify-center items-center  w-fit mx-auto text-xl" + " " + (isFocused ? "focused-input" : "")}>
                <div className="flex flex-col bg-white w-1/3 max-xl:w-1/2 max-lg:w-11/12  rounded-lg inset-shadow-sm/30 items-center" onClick={() => {if (inputRef !== null) {inputRef.current.focus()}}}>
                    <textarea ref={inputRef} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} rows={2}
                              className=" resize-none w-full p-2"
                              name="query" maxLength={255}
                              placeholder={"Describe a movie you'd like to see, and the Oracle will find it!"}></textarea>
                    <button
                        className="text-xl outline-1 outline-movie-yellow -outline-offset-4 transition-all hover:scale-110 shadow-2xl bg-primary text-white  px-4 py-1 my-2 rounded ">
                        Ask!
                    </button>
                </div>

            </form>
        </>
    )
}
