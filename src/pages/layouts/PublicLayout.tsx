import { Outlet } from "react-router";
import Footer from "../../components/Footer";
import PublicHeader from "../../components/PublicHeader";

/**
 * PublicLayout component
 *
 * This layout is used for public-facing pages such as:
 * - Home
 * - About
 * - Help
 * - Join Meeting
 * - Create Meeting (guest mode)
 *
 * It includes:
 * - A public header (`PublicHeader`)
 * - A routing outlet (`Outlet`) where the selected page is rendered
 * - A global footer (`Footer`)
 *
 * The layout fills the entire height of the screen and ensures the
 * footer remains at the bottom.
 *
 * @component
 * @returns {JSX.Element} The main layout for public routes.
 */

export default function PublicLayout() {
    return (
        
        <div className="flex flex-col h-screen justify-between">
            <PublicHeader />
            <Outlet/>
            <Footer />
        </div>
    )
}
