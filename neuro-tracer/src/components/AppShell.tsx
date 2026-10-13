// Fetch router outlets
import { Outlet } from "react-router-dom";


// Import module defined components
import NavigationLayer from "./NavigationLayer";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";


/**
 * Defines the application shell, lets the application be a router
 *  for the various pages.
 * 
 * @returns {JSX.Element} - App shell component
 */
export default function AppShell() {
    return (
        <div className = "app-shell">
            <ScrollToTop />

            <a className = "skip-link" href="main-content">
                Skip to main content
            </a>

            <NavigationLayer />

            <main className = "displayer-layer">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}