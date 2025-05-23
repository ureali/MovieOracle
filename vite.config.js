import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from  '@vitejs/plugin-react';
import {TanStackRouterVite} from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/src/main.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        TanStackRouterVite({
            routesDirectory: './resources/js/src/routes',
            generatedRouteTree: './resources/js/src/routeTree.gen.ts',
        }),
        react()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './resources/js/src'),
        },
    },
});
