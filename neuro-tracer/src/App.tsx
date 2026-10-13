// Render the UI
import { RouterProvider } from "react-router-dom";

// Import site router
import { router } from "./app/routes";


/**
 * Defines the actual app
 * 
 * @returns {JSX.Element} - Application rendered through router provider
 */
export default function App() {
    return <RouterProvider router = { router }/>;
}