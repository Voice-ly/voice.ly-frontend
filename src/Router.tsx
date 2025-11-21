import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import App from "./App";
import PublicLayout from "./pages/layouts/PublicLayout";
import LeftImageLayout from "./pages/layouts/LeftImageLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AboutUs from "./pages/AboutUs";
import Help from "./pages/Help";
import RegisterPage from "./pages/RegisterPage";
import RestorePassword from "./pages/RestorePassword";
import ForgotPassword from "./pages/ForgotPassword";
import AuthLayout from "./pages/layouts/AuthLayout";
import DashboardPage from "./pages/DashboardPage";
import JoinMeeting from "./pages/JoinMeeting";
import MeetingPage from "./pages/MeetingPage";
import ProfilePage from "./pages/ProfilePage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="app" element={<App />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="help" element={<Help />} />

                    <Route element={<LeftImageLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route
                            path="forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="reset-password"
                            element={<RestorePassword />}
                        />
                    </Route>
                </Route>
                <Route path="/" element={<AuthLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="join-meeting" element={<JoinMeeting />} />
                </Route>
                <Route path="meeting" element={<MeetingPage />} />
            </Routes>
        </BrowserRouter>
    );
}
