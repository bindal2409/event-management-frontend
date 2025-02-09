import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventService";

const AttendeeDetails = () => {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState(null);

  useEffect(() => {
    const fetchAttendee = async () => {
      try {
        const event = await getEventById(id); // Fetch event details
        if (event && event.attendees.length > 0) {
          setAttendee(event.attendees[0]); // Show first attendee (since there's only one)
        }
      } catch (error) {
        console.error("Error fetching attendee:", error);
      }
    };

    fetchAttendee();
  }, [id]);

  if (!attendee) {
    return <p className="text-center mt-10">No attendee found.</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Attendee Details</h2>
      
      {/* Attendee Info */}
      <div className="flex items-center space-x-4">
        <img
          src={`https://ui-avatars.com/api/?name=${attendee.name || "Anonymous"}&background=random`}
          alt="Attendee Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <p className="text-lg font-semibold">{attendee.name || "Anonymous"}</p>
          <p className="text-gray-600">{attendee.email || "No email provided"}</p>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
      >
        Back to Event
      </button>
    </div>
  );
};

export default AttendeeDetails;
