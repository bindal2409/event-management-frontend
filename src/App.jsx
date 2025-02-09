import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout"; // ✅ Add Logout Page
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AttendeeList from "./pages/AttendeeList";
import AttendeeDetails from "./pages/AttendeeDetails";
import ExploreEvents from "./pages/ExploreEvents";
import ViewDetails from "./pages/ViewDetails";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} /> {/* ✅ Add Logout Route */}
        <Route path="/attendees/:eventId" element={<AttendeeList />} />
        <Route path="/event/:id/attendee" element={<AttendeeDetails />} />
        <Route path="/explore" element={<ExploreEvents />} />
        <Route path="/event/:eventId" element={<ViewDetails />} />
      </Routes>
    </>
  );
}

export default App;
