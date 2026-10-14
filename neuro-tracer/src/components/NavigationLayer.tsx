// Import navigation components
import { useState } from "react";
import { NavLink } from "react-router-dom";


// Imports site navigation
import { navigation } from "./component-types";


/**
 * Provides the site navigation layer
 * 
 * @returns {JSX.Element} - Navigation layer component
 */
export default function NavigationLayer() {

    const [ menuOpen, setMenuOpen ] = useState(false);

    return (
        <header className = {`navigation-layer ${menuOpen ? "menu-open": ""}`}>
            <NavLink to = "/" className = "nuerotracer-logo">
                <img src="/Logo.png" alt="Neuro Tracer Logo"/>
                <span>NeuroTraceR</span>
            </NavLink>

            <button
                className = "navigation-menu-btn"
                type = "button"
                aria-label = "Toggle navigation"
                aria-controls = "main-navigation"
                onClick = { () => setMenuOpen(!menuOpen) }
            >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav
                className = { menuOpen ? "is-open": undefined }
                aria-label = "Main navigation"
            >
                { navigation.map( (item) => (
                    <NavLink
                        key = {item.path}
                        to = {item.path}
                        className = { ({ isActive }) => isActive ? "active" : undefined}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </header>
    );
}