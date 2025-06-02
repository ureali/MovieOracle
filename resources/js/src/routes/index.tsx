import { createFileRoute } from '@tanstack/react-router'
import Index from "../pages/index/Index"

export const Route = createFileRoute('/')({
  component: Index,
})
