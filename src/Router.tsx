import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import App from "./App";
import PublicLayout from "./pages/layouts/PublicLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Navigate to="/home" replace />} />
                <Route element={<PublicLayout />}>
                <Route index element={<App />}/>
                <Route path="/home" element={<HomePage />}/>

                    <Route index element={<App />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}
