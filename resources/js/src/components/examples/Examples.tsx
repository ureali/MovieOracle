import ExampleChat from "@/components/ExampleChat/ExampleChat.tsx";
import monkey from "../../../public/images/chats/oracle.png";
import cowboy from "../../../public/images/chats/cowboy.png";
import samurai from "../../../public/images/chats/samurai.png";
import french from "../../../public/images/chats/french.png";

const messages = [
    {
        id: "Cowboy",
        linePerson: "Howdy, what's that western movie with track that goes TA-DA-DA WAWA",
        personImg: cowboy,
        lineMonkey: "The Good, the Bad and the Ugly (1966)",
        monkeyImg: monkey
    },
    {
        id: "Samurai",
        linePerson: "Recommend me some samurai tales in Kurosawa’s style. Preferably black and white with outstanding choreography.",
        personImg: samurai,
        lineMonkey: "The Sword of Doom (1966)",
        monkeyImg: monkey
    },
    {
        id: "French",
        linePerson: "Bonjour! I want to see a moving romance movie set in Provence featuring vineyards.",
        personImg: french,
        lineMonkey: "A Good Year (2006)",
        monkeyImg: monkey
    }
]
export default function Examples() {
    return (
        <section className="mt-16">
            <h1 className=" font-bold text-4xl my-6">Examples</h1>
            <ExampleChat chatInfo={messages[0]}/>
            <ExampleChat chatInfo={messages[1]}/>
            <ExampleChat chatInfo={messages[2]}/>

        </section>
    )

}
