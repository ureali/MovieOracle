import monkey from "../../../public/images/oracle_pondering.png";
import "./Loading.css"
import {useEffect, useState} from "react";

export default function Loading() {
    const [loadingText, setLoadingText] = useState("Thinking");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingText("Oracle is taking longer than usual. Hang tight");
        }, 7000);

        return () => clearTimeout(timer);
    }, []);

    return (<main className="h-dvh flex flex-col justify-center items-center">
        <img src={monkey} loading="lazy" alt="Monkey" className="w-1/4 oracle-pondering"/>
        <h2 className="loading text-3xl max-lg:text-lg max-md:text-sm mt-8">{loadingText}</h2>
    </main>)
}
