import { Outlet } from "react-router";
import Footer from "../../components/Footer";

import AuthHeader from "../../components/AuthHeader";

export default function PublicLayout() {
    return (
        <div className="flex flex-col h-screen justify-between">
            <AuthHeader />
            <Outlet/>
            <Footer />
        </div>
    )
}
