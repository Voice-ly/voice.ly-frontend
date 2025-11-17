import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import PublicLayout from "./pages/layouts/PublicLayout";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                <Route index element={<App />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
