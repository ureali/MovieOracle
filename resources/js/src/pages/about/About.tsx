import {Link} from "@tanstack/react-router";

export default function TopFive() {
    return (
        <main className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-6">About Movie Oracle</h1>

            <p className="text-xl my-4">
                Fed up with endless scrolling on Netflix? Movie Oracle is your AI-powered movie recommendation engine that delivers personalized film picks.
            </p>

            <h2 className="text-3xl font-semibold mt-8 mb-4">Why Movie Oracle?</h2>
            <ul className="list-disc list-inside text-xl space-y-2">
                <li><strong>Truly personalized:</strong> No more generic top 10 lists.</li>
                <li><strong>Cross-platform:</strong> Works across Netflix, Hulu, Prime, Disney+ and more.</li>
                <li><strong>Laser-precise:</strong> Discovers hidden gems, sometimes even films without a proper English translations (as long as they're latin script).</li>
            </ul>

            <h2 className="text-3xl font-semibold mt-8 mb-4">How It Works</h2>
            <p className="text-xl my-4">
                Movie Oracle combines Google Search grounding with the Gemini LLM API. Every suggestion is validated against a comprehensive movie database to keep hallucinations near zero. If a title can’t be verified, you’ll see an error instead of nonsense.
            </p>

            <h2 className="text-3xl font-semibold mt-8 mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-xl space-y-2">
                <li>Low hallucination rate: near-zero false recommendations</li>
                <li>Unlimited scope: no ties to a single service</li>
                <li>Instant results: get suggestions in under 10 seconds</li>
            </ul>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Get in Touch</h2>
            <p className="text-xl my-4">
                Built solely by me. I'm happy to hear any suggestions/inquiries. Reach out via my <a
                    href="https://stanislavnehretskyi.com/contact"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                >personal website</a> or <a
                    href="https://www.linkedin.com/in/stanislav-nehretskyi/"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                >LinkedIn</a>.
            </p>

            <Link
                to="/"
                className="block mx-auto mt-8 w-fit text-primary font-bold ring-2 ring-primary p-4 rounded-2xl text-3xl font-bangers tracking-widest hover:drop-shadow-[0_0_8px_rgba(255,0,0,1)] transition-all max-lg:static max-md:my-8"
            >
                Back to Oracle
            </Link>
        </main>
    );
}
