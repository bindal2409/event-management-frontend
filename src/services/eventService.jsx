import axios from "axios";

const API_URL = "http://localhost:5000/api/events"; // Adjust if needed

export const getEvents = async (query = "", token) => {
  const response = await axios.get(`${API_URL}${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createEvent = async (eventData, token) => {
  const formData = new FormData();
  for (const key in eventData) {
    formData.append(key, eventData[key]);
  }

  const response = await axios.post(API_URL, formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const deleteEvent = async (eventId, token) => {
  await axios.delete(`${API_URL}/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateEvent = async (eventId, updatedEvent, token) => {
  const response = await axios.put(`${API_URL}/${eventId}`, updatedEvent, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const registerForEvent = async (eventId, token) => {
    if (!eventId) {
        console.error("❌ Missing Event ID in registerForEvent");
        throw new Error("Event ID is required");
    }
    if (!token) {
        console.error("❌ Missing Token in registerForEvent");
        throw new Error("User is not authenticated");
    }

    const response = await axios.post(`${API_URL}/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data; // ✅ Ensure we return the updated event
};


  export const unregisterFromEvent = async (eventId, token) => {
    const response = await axios.delete(`${API_URL}/${eventId}/unregister`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // ✅ Ensure function returns correct response
  };
  
  
  

// ✅ Add this function to fetch event by ID
export const getEventById = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`);
  return response.data;
};
