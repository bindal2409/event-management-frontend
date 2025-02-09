import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);
  
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Fetches events from the API and updates the state with the retrieved data.
 * Retrieves the authentication token from local storage and uses it to
 * authenticate the request. Logs the fetched events to the console for
 * debugging purposes. Updates the events state with the fetched data.
 * Handles and logs any errors that occur during the fetching process.
 */

/******  714ebd37-dd15-4f44-85f1-3ab4b458d2b1  *******/  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getEvents("", token);
      console.log("Fetched Events:", data); // ✅ Log events to check image URLs
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Hero Section */}
      <div 
        className="relative h-[450px] flex items-center justify-center text-center text-white"
        style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?conference,event')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-5xl font-extrabold leading-tight">Find & Join Exciting Events!</h1>
          <p className="mt-3 text-lg text-gray-300">Explore events, register, and experience the best gatherings.</p>
          <button 
            onClick={() => navigate("/explore")}
            className="mt-5 px-6 py-3 bg-purple-600 hover:bg-purple-800 transition-all duration-300 text-white text-lg font-medium rounded-full shadow-lg"
          >
            Explore Events
          </button>
        </div>
      </div>

      {/* ✅ Event Listings */}
      <div className="container mx-auto py-12 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800">Upcoming Events</h2>

        {/* ✅ Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          {events.length > 0 ? (
            events.map((event) => (
              <div 
                key={event._id} 
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={event.imageUrl ? event.imageUrl : "https://dummyimage.com/400x250/cccccc/000000.png&text=No+Image"} 
                  alt={event.title} 
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                  <p className="text-gray-500 text-sm mt-2">📅 {new Date(event.date).toDateString()}</p>
                  <button 
                    onClick={() => navigate(`/event/${event._id}`)}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-800 transition-all duration-300 text-white rounded-md shadow"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full text-xl font-semibold mt-6">No upcoming events found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
