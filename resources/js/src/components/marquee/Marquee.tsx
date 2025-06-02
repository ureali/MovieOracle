import "./Marquee.css"

type MarqueeProps = {
    title:string;
}
export default function Marquee({ title }:MarqueeProps) {
    const numLightsHorizontal = title.length < 10 ? 5 : 10;
    const numLightsVertical = 4;

    function renderLights(count:number, side:string) {
        let numPlainTopLights:number;
        let numArchLights:number;
        if (side == "top") {
            numArchLights = 3/5 * count;
            numPlainTopLights = count - numArchLights;

        }
        return Array.from({length: count}).map((_, i) => {

            if (side == "top" && (i >= numPlainTopLights / 2 && i < (count - numPlainTopLights / 2))) {
                // adjusting for curve
                if (i == numPlainTopLights / 2 || i == (count - numPlainTopLights / 2 - 1)) {
                    return <div key={side + "-" + i} className="bulb bulb-arch-curve"/>
                }
                return <div key={side + "-" + i} className="bulb bulb-arch" />
            }
            else {
                return <div key={side + "-" + i} className="bulb" />
            }

        })
    }

    return (
        <div
            className="marquee flex justify-center items-center w-fit mx-auto my-14 relative text-center px-10 py-12 bg-white font-bangers text-6xl border-[16px] border-solid rounded-2xl">
            <h1 className="">
                {title}
            </h1>
            <div className="marquee-lights marquee-lights-top ">
                {renderLights(numLightsHorizontal, "top")}
            </div>
            <div className="marquee-lights marquee-lights-bottom ">
                {renderLights(numLightsHorizontal, "bottom")}
            </div>
            <div className="marquee-lights marquee-lights-left ">
                {renderLights(numLightsVertical, "left")}
            </div>
            <div className="marquee-lights marquee-lights-right ">
                {renderLights(numLightsVertical, "right")}
            </div>
        </div>
    )
}
