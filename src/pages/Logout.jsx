import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // Remove auth token
    window.dispatchEvent(new Event("authChange")); // Notify other components
    setTimeout(() => navigate("/login"), 2000); // Redirect after delay
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-red-500 to-yellow-500 text-white">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-900">
        <h2 className="text-2xl font-bold">Logging out...</h2>
        <p className="mt-2 text-gray-600">Redirecting to login page.</p>
      </div>
    </div>
  );
};

export default Logout;
