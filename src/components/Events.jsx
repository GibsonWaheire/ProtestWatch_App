// src/components/Events.jsx
import React, { useState, useRef, useEffect } from "react";
import eventsData from "../data/events.json";

// Helper to get initials for avatar
function getInitials(text) {
  return text
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

function getAllEvents() {
  // Merge static and localStorage events, dedupe by id
  const local = JSON.parse(localStorage.getItem("events") || "[]");
  const staticEvents = eventsData.map(e => ({ ...e, opinions: e.opinions || [] }));
  const all = [...local, ...staticEvents.filter(e => !local.some(ev => ev.id === e.id))];
  return all;
}

function Events() {
  const [events, setEvents] = useState(getAllEvents());
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [opinionText, setOpinionText] = useState("");
  const inputRef = useRef(null);

  // Listen for real-time updates
  useEffect(() => {
    const update = () => setEvents(getAllEvents());
    window.addEventListener("eventsUpdated", update);
    return () => window.removeEventListener("eventsUpdated", update);
  }, []);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= now
  );
  const pastEvents = events.filter(
    (e) => new Date(e.date) < now
  );

  // Scroll to input when modal opens
  useEffect(() => {
    if (selectedEventId && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      inputRef.current.focus();
    }
  }, [selectedEventId]);

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

  // Modal component
  function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity animate-fadeIn">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-slideUp">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    );
  }

  // Card for each event
  function EventCard({ event }) {
    const isOpen = selectedEventId === event.id;
    return (
      <div className={`relative bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:scale-105`}> 
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-blue-700">{event.title}</span>
          <span className="ml-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">{event.opinions.length}</span>
        </div>
        <div className="text-blue-500 text-sm mb-1">{event.location}</div>
        <div className="text-gray-500 text-xs mb-1">{event.date}</div>
        <div className="text-gray-600 text-xs mb-2">Status: <span className={event.status === 'Active' ? 'text-green-600' : event.status === 'Upcoming' ? 'text-yellow-600' : 'text-gray-400'}>{event.status}</span></div>
        <button
          className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          onClick={() => setSelectedEventId(event.id)}
        >
          View Opinions
        </button>
        <Modal open={isOpen} onClose={() => setSelectedEventId(null)}>
          <h3 className="font-bold text-lg mb-3 text-center text-blue-700">Opinions for {event.title}</h3>
          <div className="flex flex-col gap-2 mb-4 max-h-40 overflow-y-auto">
            {event.opinions.length > 0 ? (
              event.opinions.map((opinion, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold text-sm">
                    {getInitials(opinion)}
                  </span>
                  <span className="text-gray-800 text-sm">{opinion}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-center">No opinions yet.</span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              ref={inputRef}
              type="text"
              value={opinionText}
              onChange={(e) => setOpinionText(e.target.value)}
              placeholder="Add your opinion..."
              className="border border-blue-300 p-2 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={e => { if (e.key === 'Enter') handleAddOpinion(event.id); }}
            />
            <button
              onClick={() => handleAddOpinion(event.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              Submit
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <h2 className="text-4xl font-extrabold italic text-center text-blue-800 mb-8 drop-shadow">Events</h2>
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">Upcoming Events</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          )) : <span className="text-gray-500">No upcoming events.</span>}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Past Events</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.length > 0 ? pastEvents.map(event => (
            <EventCard key={event.id} event={event} />
          )) : <span className="text-gray-400">No past events.</span>}
        </div>
      </div>
      {/* Animations for modal */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(.4,2,.6,1); }
      `}</style>
    </div>
  );
}

export default Events;
