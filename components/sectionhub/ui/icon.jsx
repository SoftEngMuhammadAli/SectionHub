export function Icon({ name, className = "h-4 w-4" }) {
    const common = { className, fill: "none", stroke: "currentColor", strokeWidth: "1.7", viewBox: "0 0 24 24" };
    switch (name) {
        case "menu":
            return <svg {...common}><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>;
        case "close":
            return <svg {...common}><path d="m6 6 12 12"/><path d="M18 6 6 18"/></svg>;
        case "chevron-right":
            return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
        case "filter":
            return <svg {...common}><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>;
        case "home":
            return <svg {...common}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>;
        case "layers":
            return <svg {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></svg>;
        case "upload":
            return <svg {...common}><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 20h16"/></svg>;
        case "package":
            return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 12 20 7.5"/><path d="M12 12 4 7.5"/><path d="M12 21v-9"/></svg>;
        case "grid":
            return <svg {...common}><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>;
        case "tag":
            return <svg {...common}><path d="M20 10 10 20l-7-7L13 3h5l2 2v5Z"/><circle cx="16" cy="8" r="1"/></svg>;
        case "chart":
            return <svg {...common}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20V8"/></svg>;
        case "receipt":
            return <svg {...common}><path d="M7 3h10v18l-3-2-2 2-2-2-3 2V3Z"/><path d="M9 8h6"/><path d="M9 12h6"/></svg>;
        case "users":
            return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="3.5"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a3.5 3.5 0 0 1 0 6.74"/></svg>;
        case "activity":
            return <svg {...common}><path d="M3 12h4l2.5-6 4 12 2.5-6H21"/></svg>;
        case "settings":
            return <svg {...common}><path d="M12 3v3"/><path d="M12 18v3"/><path d="m4.9 4.9 2.1 2.1"/><path d="m17 17 2.1 2.1"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="m4.9 19.1 2.1-2.1"/><path d="m17 7 2.1-2.1"/><circle cx="12" cy="12" r="3.5"/></svg>;
        case "search":
            return <svg {...common}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></svg>;
        case "bell":
            return <svg {...common}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
        case "help":
            return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.3-1.7 2.7"/><path d="M12 17h.01"/></svg>;
        default:
            return <svg {...common}><circle cx="12" cy="12" r="8"/></svg>;
    }
}
