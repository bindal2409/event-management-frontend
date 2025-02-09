import { useEffect, useState } from "react";
import { getEvents, createEvent, deleteEvent, updateEvent, registerForEvent, unregisterFromEvent } from "../services/eventService";
import EventCard from "../components/EventCard";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: "", location: "", sort: "" });
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",  // ✅ Restored description input
    date: "",
    location: "",
    category: "Tech",
    image: null,
  });

  const [editEvent, setEditEvent] = useState(null); // ✅ State to track the event being edited

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
    socket.on("updateEvent", fetchEvents);
    socket.on("eventCreated", (event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
    });

    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    return () => {
      socket.off("updateEvent", fetchEvents);
      socket.off("eventCreated");
    };
  }, [filters, darkMode]);

  const fetchEvents = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const data = await getEvents(`?${query}`, token);
      setEvents(data.map(event => ({ ...event, attendees: event.attendees || [] })));
    } catch (error) {
      console.error("❌ Error fetching events:", error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editEvent) {
      setEditEvent({ ...editEvent, [name]: value });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (editEvent) {
        setEditEvent((prevEvent) => ({ ...prevEvent, image: file }));
      } else {
        setNewEvent((prevEvent) => ({ ...prevEvent, image: file }));
      }
    }
  };

  const handleCreate = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location || !newEvent.image) {
      alert("All fields including description and image are required!");
      return;
    }

    try {
      await createEvent(newEvent, token);
      fetchEvents();
      setNewEvent({ title: "", description: "", date: "", location: "", category: "Tech", image: null });

      const fileInput = document.getElementById("imageInput");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error creating event:", error.response ? error.response.data : error.message);
      alert("Failed to create event.");
    }
  };

  

  const handleDelete = async (eventId) => {
    if (!token) {
      alert("You must be logged in to delete an event.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId, token);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  const handleEdit = (event) => {
    setEditEvent(event); // ✅ Set the selected event in edit mode
  };

  const handleUpdate = async () => {
    if (!editEvent) return;
  
    try {
      await updateEvent(editEvent._id, editEvent, token);
      fetchEvents();
      setEditEvent(null); // ✅ Close edit mode after saving
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };
  


  const handleRegister = async (eventId) => {
    try {
      if (!eventId) throw new Error("Event ID is missing");
      if (!token) throw new Error("User is not authenticated");

      const response = await registerForEvent(eventId, token);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, attendees: response.event.attendees } : event
        )
      );
      socket.emit("register", eventId);
    } catch (error) {
      console.error("❌ Error registering for event:", error);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      if (!eventId) throw new Error("Event ID is missing");
      if (!token) throw new Error("User is not authenticated");

      const response = await unregisterFromEvent(eventId, token);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, attendees: response.event?.attendees ?? [] } : event
        )
      );
      socket.emit("unregister", eventId);
    } catch (error) {
      console.error("Error unregistering for event:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto bg-white shadow-lg p-6 rounded-lg text-center">
        <h2 className="text-4xl font-bold text-indigo-700">🎉 Event Dashboard</h2>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-3 mt-6 items-center justify-center">
        <select name="category" onChange={handleFilterChange} className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-500">
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Music">Music</option>
          <option value="Education">Education</option>
          <option value="Business">Business</option>
          <option value="Sports">Sports</option>
        </select>

        <input type="text" name="location" placeholder="Search Location" onChange={handleFilterChange} className="border p-2 rounded-md" />

        <select name="sort" onChange={handleFilterChange} className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-500">
          <option value="">Sort By</option>
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Create Event Form */}
      <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-indigo-600">Create a New Event</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input type="text" name="title" placeholder="Title" value={newEvent.title} onChange={handleChange} className="border p-2 rounded-md" />
          <input type="date" name="date" value={newEvent.date} onChange={handleChange} className="border p-2 rounded-md" />
          <input type="text" name="location" placeholder="Location" value={newEvent.location} onChange={handleChange} className="border p-2 rounded-md" />
          <select name="category" value={newEvent.category} onChange={handleChange} className="border p-2 rounded-md">
            <option value="Tech">Tech</option>
            <option value="Music">Music</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
            <option value="Sports">Sports</option>
          </select>
          <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleChange} className="border p-2 rounded-md col-span-2" />
          <input id="imageInput" type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded-md col-span-2" />
        </div>
        <button onClick={handleCreate} className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-indigo-800">
          Create Event
        </button>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} onEdit={handleEdit} onDelete={handleDelete} onRegister={handleRegister} onUnregister={handleUnregister} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
