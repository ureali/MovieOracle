import {createRoot} from 'react-dom/client'
// @ts-ignore
import React from "react";
import App from "./App";

const rootElement = document.getElementById("root")!!;
const root = createRoot(rootElement)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
