import SpeechBubble from "@/components/SpeechBubble/SpeechBubble.tsx";
import ExampleChatIcon from "@/components/ExampleChatIcon/ExampleChatIcon.tsx";

type ExampleChatProps = {
    chatInfo: {
        personImg: string;
        monkeyImg: string;
        linePerson: string;
        lineMonkey: string;
    }
}

export default function ExampleChat({chatInfo}:ExampleChatProps){
    return (
        <div className="w-1/2 max-xl:w-11/12 mx-auto my-28 border-b border-solid pb-6">
            <div className="flex flex-col justify-evenly items-start relative">
                <SpeechBubble line={chatInfo.linePerson} position="right" isOracle={false}/>
                <ExampleChatIcon url={chatInfo.personImg}/>
            </div>
            <div className="flex flex-col justify-evenly relative items-end">
                <SpeechBubble line={chatInfo.lineMonkey} position="left" isOracle={true}/>
                <ExampleChatIcon url={chatInfo.monkeyImg}/>
            </div>
        </div>
    )
}
