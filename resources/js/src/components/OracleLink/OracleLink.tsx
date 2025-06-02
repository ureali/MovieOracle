import {Link} from "@tanstack/react-router";

type OracleLinkProps = {
    text:string,
    destination: string,
    target?: string
}

export default function OracleLink({text, destination, target}:OracleLinkProps) {
    return <Link className=" block mx-auto mt-8 w-fit text-primary font-bold ring-2 ring-primary p-4 rounded-2xl text-3xl font-bangers tracking-widest hover:drop-shadow-[0_0_8px_rgba(255,0,0,1)] transition-all max-lg:static max-md:my-8" to={destination} target={target ? target : "_self"}>{text}</Link>
}
