// Fetch browser router
import { createBrowserRouter } from "react-router-dom";

// Import appshell
import AppShell from "../components/AppShell";

// Import site pages
import Home from "../pages/Home";
import About from "../pages/About";
import Account from "../pages/Account";
import Catalogue from "../pages/Catalogue";


// Defines the site router for the app.tsx
export const router = createBrowserRouter([

    {
        path: "/",
        element: <AppShell />,

        children: [
            {
                index: true,
                element: <Home />
            },

            {
                path: "about",
                element: <About />
            },

            {
                path: "home",
                element: <Home />
            },

            {
                path: "account",
                element: <Account />
            },

            {
                path: "catalogue",
                element: <Catalogue />
            }
        ]
    }

]);