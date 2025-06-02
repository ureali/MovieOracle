import "./Footer.css"
import {Link} from "@tanstack/react-router";
export default function Footer() {
    return (
        <footer className="text-center mt-20 p-4">
            <div className="flex flex-col">
                <p>Made with ❤️ by Stanislav Nehretskyi • Copyright {new Date().getFullYear()}</p>
                <nav className="flex flex-row justify-center gap-3 mt-3">
                    <Link to={"/"} className="text-blue-600 dark:text-blue-500 hover:underline">Home</Link>
                    <Link to={"/about"} className="text-blue-600 dark:text-blue-500 hover:underline">About</Link>
                    <Link to={"/faq"} className="text-blue-600 dark:text-blue-500 hover:underline">FAQ</Link>

                </nav>
            </div>

        </footer>
    )
}
