import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import App from "./App";
import PublicLayout from "./pages/layouts/PublicLayout";
import LeftImageLayout from "./pages/layouts/LeftImageLayout";    
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthLayout from "./pages/layouts/AuthLayout";
import DashboardPage from "./pages/DashboardPage";
import MeetingPage from "./pages/MeetingPage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="app" element={<App />} />

                    <Route element={<LeftImageLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                    </Route>
                </Route>
                <Route path="/" element={<AuthLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                </Route>
                <Route path="meeting" element={<MeetingPage />} />
            </Routes>
        </BrowserRouter>
    );
}