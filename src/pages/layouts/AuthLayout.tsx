import { Outlet } from "react-router";
import Footer from "../../components/Footer";

import AuthHeader from "../../components/AuthHeader";

/**
 * PublicLayout component
 *
 * This layout is used for all public pages (e.g., login, register, home),
 * providing a consistent header and footer across the application.
 * The `<Outlet />` renders the matched child route.
 *
 * The layout uses a vertical flexbox structure to distribute space so
 * the header stays at the top, the footer stays at the bottom, and the
 * child content expands in the middle.
 *
 * @component
 * @returns {JSX.Element} The public page layout.
 */

export default function PublicLayout() {
    return (
        <div className="flex flex-col h-screen justify-between">
            <AuthHeader />
            <Outlet/>
            <Footer />
        </div>
    )
}
