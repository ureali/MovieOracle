import { createFileRoute } from '@tanstack/react-router'
import Recommend from "@/pages/recommend/Recommend.tsx";

export const Route = createFileRoute('/recommend')({
    component: Recommend,
})
