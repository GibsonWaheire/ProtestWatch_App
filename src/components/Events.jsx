// src/components/Events.jsx
import React, { useState } from "react";
import eventsData from "../data/events.json";

function Events() {
  const [events, setEvents] = useState(eventsData);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [opinionText, setOpinionText] = useState("");

  const handleAddOpinion = (eventId) => {
    if (!opinionText.trim()) return;

    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          opinions: [...event.opinions, opinionText],
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setOpinionText("");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold italic text-center text-black mb-6">Events</h2>

      {events.map((event) => (
        <div key={event.id} className="border p-4 rounded-lg mb-6 bg-white shadow">
          <p className="text-xl font-semibold text-blue-600">{event.title}</p>
          <p className="text-blue-500">📍 {event.location}</p>
          <p className="text-gray-600">📅 {event.date}</p>
          <p className="text-gray-600">🔴 Status: {event.status}</p>

          <button
            className="text-blue-500 mt-2 underline"
            onClick={() =>
              setSelectedEventId(selectedEventId === event.id ? null : event.id)
            }
          >
            {selectedEventId === event.id ? "Hide Opinions" : "View Opinions"}
          </button>

          {selectedEventId === event.id && (
            <div className="mt-4">
              <h3 className="font-bold mb-2 italic text-black">Opinions:</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {event.opinions.length > 0 ? (
                  event.opinions.map((opinion, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {opinion}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No opinions yet.</span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={opinionText}
                  onChange={(e) => setOpinionText(e.target.value)}
                  placeholder="Add your opinion..."
                  className="border p-2 rounded w-40"
                />
                <button
                  onClick={() => handleAddOpinion(event.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Events;
