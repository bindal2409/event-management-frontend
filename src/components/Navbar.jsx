import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import axios from "axios";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const handleGuestLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/guest");
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("authChange"));
      navigate("/dashboard");
    } catch (error) {
      alert("Guest login failed");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold tracking-wide">Event Management</h1>
      <div>
        <Link to="/" className="mr-4 hover:underline">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700 transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">Login</Link>
            <Link to="/register" className="mr-4 hover:underline">Register</Link>
            <button onClick={handleGuestLogin} className="bg-gray-500 px-4 py-2 ml-2 rounded-md hover:bg-gray-700 transition">
              Guest Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
