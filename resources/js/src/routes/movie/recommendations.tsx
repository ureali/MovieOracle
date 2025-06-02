import { createFileRoute } from '@tanstack/react-router'
import TopFive from "@/pages/top-five/TopFive.tsx";

type MovieRecs = {
    ids: string[]
}
export const Route = createFileRoute("/movie/recommendations")({
    validateSearch: (search:Record<string, unknown>):MovieRecs => {
        return {
            ids: Array.isArray(search.ids) ? (search.ids as string[]) : typeof search.ids == "string" ? [search.ids] : []
        }
    },
    component: TopFive,
})
