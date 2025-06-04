import "./SpeechBubble.css";

type SpeechBubbleProps = {
    line:string;
    position:"left"|"right";
    isOracle:boolean;
}

export default function SpeechBubble({line, position, isOracle}:SpeechBubbleProps) {
    return (
        <p className={`bubble rounded-lg shadow bg-amber-50 dark:bg-black p-6 max-md:p-4 max-md:text-sm ${position} ${isOracle && 'oracle'} text-${position == "left" ? "right" : "left"}`}>
            {line}
        </p>


    )
}
