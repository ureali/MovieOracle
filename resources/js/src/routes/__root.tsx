import { Outlet, createRootRoute } from '@tanstack/react-router'
import Footer from "@/components/Footer/Footer.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
            <Outlet />
            <Footer/>
    </>
  ),
})
