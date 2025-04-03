import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SplashScreen from "./components/SplashScreen";
import HomePage from "./pages/HomePage";
import Emitters from "./pages/Emitters";
import EmitterDetail from "./pages/EmitterDetail";

export default function AppRouter() {
  return (
    <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/emitters" element={<Emitters />} />
        <Route path="/emitter/:id" element={<EmitterDetail />} />
    </Routes>
  )
}
