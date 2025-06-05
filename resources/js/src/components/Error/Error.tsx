import sadOracle from "../../../public/images/sad_oracle.png"
import {Link} from "@tanstack/react-router";

type ErrorProps = {
    code?: string;
}
export default function Error({code}:ErrorProps) {
    if (code == "404") {
        return (
            <main>
                <img src={sadOracle} alt="Sad orangutan with popcorn and film reel"
                     className="w-1/4 max-md:w-1/2 block mx-auto"/>
                <h2 className="text-4xl text-red-600 font-bold my-6 max-w-5xl mx-auto text-center">Oracle Has Encountered an
                    Error!</h2>
                    <p className="text-2xl font-bold max-w-5xl mx-auto text-center">404 Page Not Found.</p>
                <Link
                    className="block w-fit text-white my-12 hover:bg-red-600 transition-all mx-auto p-4 bg-primary rounded-lg "
                    to="/">Back to Home</Link>
            </main>
        )
    }

    if (code=="503") {
        return (
            <main>
                <img src={sadOracle} alt="Sad orangutan with popcorn and film reel"
                     className="w-1/4 max-md:w-1/2 block mx-auto"/>
                <h2 className="text-4xl text-red-600 font-bold my-6 max-w-5xl mx-auto text-center">Oracle Has Encountered an
                    Error!</h2>
                <p className="text-2xl max-w-5xl mx-auto text-center">Our Oracle is overloaded due to high demand. Please try again later.</p>
                <Link
                    className="block w-fit text-white my-12 hover:bg-red-600 transition-all mx-auto p-4 bg-primary rounded-lg "
                    to="/">Back to Home</Link>
            </main>
        )
    }

    return (
        <main>
            <img src={sadOracle} alt="Sad orangutan with popcorn and film reel"
                 className="w-1/4 max-md:w-1/2 block mx-auto"/>
            <h2 className="text-4xl text-red-600 font-bold my-6 max-w-5xl mx-auto text-center">Oracle Has Encountered an
                Error!</h2>
            <p className="text-lg max-w-5xl mx-auto text-center">An unknown error has occurred while processing
                your request. Please try again and double check if your request was formed correctly.</p>
            <p className="text-lg max-w-5xl mx-auto text-center">P.S. if you encountered the error after
                entering the movie description, ensure you did not ask oracle for anything but a movie. Oracle
                gets confused if he's asked unrelated information.</p>
            <Link
                className="block w-fit text-white my-12 hover:bg-red-600 transition-all mx-auto p-4 bg-primary rounded-lg "
                to="/">Back to Home</Link>
        </main>
    )
}
