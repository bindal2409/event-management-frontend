const AttendeeModal = ({ event, onClose }) => {
    if (!event) return null; // ✅ Ensure event is valid
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold">{event.title} - Attendees</h2>
          <ul className="mt-4">
            {event.attendees.length > 0 ? (
              event.attendees.map((attendee) => (
                <li key={attendee._id} className="border-b py-2">
                  {attendee.name} ({attendee.email})
                </li>
              ))
            ) : (
              <p>No attendees yet.</p>
            )}
          </ul>
          <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default AttendeeModal;
  