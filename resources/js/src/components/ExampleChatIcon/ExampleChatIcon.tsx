type ExampleChatIconProp = {
    url:string;
}

export default function ExampleChatIcon({url}:ExampleChatIconProp) {
    return (
        <div className="border border-solid rounded-full w-[128px] h-[128px] max-md:w-[64px] max-md:h-[64px]">
            <img src={url} alt="An Icon Representing a Person talking" loading="lazy" width="128" height="128"/>
        </div>
    )
}
