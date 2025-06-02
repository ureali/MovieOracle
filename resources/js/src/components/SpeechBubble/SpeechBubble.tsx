import "./SpeechBubble.css";

type SpeechBubbleProps = {
    line:string;
    position:"left"|"right";
    isOracle:boolean;
}

export default function SpeechBubble({line, position, isOracle}:SpeechBubbleProps) {
    return (
        <p className={`bubble rounded-lg shadow bg-amber-50 p-6 ${position} ${isOracle && 'oracle'} text-${position == "left" ? "right" : "left"}`}>
            {line}
        </p>


    )
}
