import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import App from "./App";
import PublicLayout from "./pages/layouts/PublicLayout";
import RightImageLayout from "./pages/layouts/RightImageLayout";    
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="app" element={<App />} />

                    <Route element={<RightImageLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}