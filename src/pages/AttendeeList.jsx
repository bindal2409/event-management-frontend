import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById} from "../services/eventService";

const AttendeeList = () => {
  const { eventId } = useParams(); // Get event ID from URL
  const [attendees, setAttendees] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const navigate = useNavigate(); // For redirecting if needed

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const event = await getEventById(eventId);
      setAttendees(event.attendees || []);
      setEventTitle(event.title || "Event");
    } catch (error) {
      console.error("Error fetching attendees:", error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-700">{eventTitle} - Attendees</h2>

      {attendees.length > 0 ? (
        <ul className="space-y-4">
          {attendees.map((attendee, index) => (
            <li key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-sm">
              <div>
                <p className="text-lg font-semibold text-gray-800">{attendee.name || "Anonymous"}</p>
                <p className="text-sm text-gray-600">{attendee.email || "No email provided"}</p>
                <p className="text-xs text-gray-500">Registered on: {new Date(attendee.registeredAt).toDateString()}</p>
              </div>

              {/* ✅ Remove Attendee Button */}
              {/* <button
                onClick={() => handleRemoveAttendee(attendee._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
              >
                Remove
              </button> */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No attendees yet.</p>
      )}

      {/* ✅ Back Button */}
      <button onClick={() => navigate(-1)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Back to Event
      </button>
    </div>
  );
};

export default AttendeeList;
