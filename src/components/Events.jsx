// src/components/Events.jsx
// src/components/Events.jsx
import React from "react";
import eventsData from "../data/events.json"; // ✅ Adjust path if needed

function Events() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">All Reported Events</h2>

      <ul className="space-y-4">
        {eventsData.length > 0 ? (
          eventsData.map((event) => (
            <li key={event.id} className="border rounded-lg p-4 shadow bg-white">
              <p className="font-semibold text-lg">{event.title}</p>
              <p className="text-gray-700">📍 {event.location}</p>
              <p className="text-gray-700">📅 {event.date}</p>
              <p className="text-gray-700">🔴 Status: {event.status}</p>
            </li>
          ))
        ) : (
          <li>No events found.</li>
        )}
      </ul>
    </div>
  );
}

export default Events;
