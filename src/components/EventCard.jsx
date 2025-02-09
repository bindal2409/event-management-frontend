import { Link } from "react-router-dom"; 
import { motion } from "framer-motion";

const EventCard = ({ event, onEdit, onDelete, onRegister, onUnregister }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg backdrop-blur-md bg-opacity-80 dark:bg-opacity-60 transition-all flex flex-col justify-between"
    >
      {/* ✅ Display event image with a fixed aspect ratio */}
      {event.imageUrl && (
        <img
          src={`${event.imageUrl}?timestamp=${new Date().getTime()}`}
          alt={event.title}
          className="w-full h-48 object-cover rounded-md"
        />
      )}

      {/* ✅ Event Info */}
      <div className="flex-grow mt-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {new Date(event.date).toDateString()} - {event.location}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Category: {event.category}</p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
          Attendees: {event.attendees.length}
        </p>
      </div>

      {/* ✅ Buttons Section */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onRegister(event._id)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Register
        </button>
        <button
          onClick={() => onUnregister(event._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Unregister
        </button>

        <Link to={`/event/${event._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          View Details
        </Link>

        <button
          onClick={() => onEdit(event)}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(event._id)}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default EventCard;
