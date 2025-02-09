import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import EventCard from "../components/EventCard";

const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter((event) =>
      event.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((event) => (category ? event.category === category : true))
    .sort((a, b) => {
      if (sortBy === "date") return new Date(a.date) - new Date(b.date);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-4xl font-bold text-center">Explore Events</h2>

      {/* ✅ Filters Section */}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <input
          type="text"
          placeholder="Search events..."
          className="border p-2 rounded-md w-full sm:w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded-md"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Music">Music</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
          <option value="Sports">Sports</option>
        </select>
        <select
          className="border p-2 rounded-md"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* ✅ Loading Animation */}
      {loading ? (
        <p className="text-center text-gray-500 mt-6">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No events found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreEvents;
