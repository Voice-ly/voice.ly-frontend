import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import PublicLayout from "./pages/layouts/PublicLayout";
import HomePage from "./pages/layouts/HomePage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                <Route index element={<App />}/>
                <Route path="/home" element={<HomePage />}/>

                </Route>
            </Routes>
        </BrowserRouter>
    );
}
