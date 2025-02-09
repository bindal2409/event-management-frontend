import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById, registerForEvent, unregisterFromEvent } from "../services/eventService";

const ViewDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    await registerForEvent(eventId, token);
    setEvent({ ...event, attendees: [...(event.attendees ?? []), "You"] });
  };

  const handleUnregister = async () => {
    await unregisterFromEvent(eventId, token);
    setEvent({ ...event, attendees: event.attendees?.filter((a) => a !== "You") ?? [] });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Event link copied to clipboard!");
  };

  if (loading) return <p className="text-center text-gray-500">Loading event...</p>;
  if (!event) return <p className="text-center text-red-500">Event not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover rounded-md" />
      <h2 className="text-3xl font-bold mt-4">{event.title}</h2>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <p className="text-sm text-gray-500 mt-2">📅 {new Date(event.date).toDateString()}</p>

      <div className="flex gap-4 mt-4">
        <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Register
        </button>
        <button onClick={handleUnregister} className="bg-red-500 text-white px-4 py-2 rounded-md">
          Unregister
        </button>
        <button onClick={handleShare} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Share Event
        </button>
      </div>

      <h3 className="mt-6 text-lg font-semibold">Attendees ({event.attendees?.length ?? 0})</h3>
      <ul className="mt-2 text-gray-600">
        {event.attendees?.map((attendee, index) => (
          <li key={index}>{attendee.name ?? "Anonymous"}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewDetails;
