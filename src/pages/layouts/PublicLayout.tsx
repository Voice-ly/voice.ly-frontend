import { Outlet } from "react-router";
import Footer from "../../components/Footer";
import PublicHeader from "../../components/PublicHeader";

export default function PublicLayout() {
    return (
        <div className="flex flex-col h-screen justify-between">
            <PublicHeader />
            <Outlet/>
            <Footer />
        </div>
    )
}
