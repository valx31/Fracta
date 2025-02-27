import { useEffect } from "react";
import { useNavigate } from "react-router";
import logo from "/logo.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <img src={logo} alt="logo" />
    </div>
  );
}
