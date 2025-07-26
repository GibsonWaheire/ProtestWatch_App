// src/components/Events.jsx
import React, { useState, useEffect, useCallback } from "react";
import eventsData from "../data/events.json";
import { useSearchParams } from "react-router-dom";

// API base URL
const API_BASE_URL = 'http://localhost:4000/api';

// Helper to get initials for avatar
function getInitials(text) {
  return text
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

// Helper to format timestamps
function formatTimestamp(timestamp) {
  const now = new Date();
  const diff = now - new Date(timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(timestamp));
}

// Helper to generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getAllEvents() {
  const local = JSON.parse(localStorage.getItem("events") || "[]");
  const staticEvents = eventsData.map(e => ({ ...e, opinions: e.opinions || [] }));
  const all = [...local, ...staticEvents.filter(e => !local.some(ev => ev.id === e.id))];
  return all;
}

// Helper function to fetch opinions from API
const fetchOpinionsFromAPI = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/opinions/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch opinions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching opinions:', error);
    return [];
  }
};

// Helper function to submit opinion to API
const submitOpinionToAPI = async (eventId, comment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/opinions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId, comment }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit opinion');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting opinion:', error);
    throw error;
  }
};

// Separate OpinionModal component to prevent re-renders
function OpinionModal({ open, onClose, event, onSubmit }) {
  const [opinionText, setOpinionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localOpinions, setLocalOpinions] = useState([]);

  // Load opinions from API when modal opens
  useEffect(() => {
    if (open && event) {
      const loadOpinions = async () => {
        try {
          const apiOpinions = await fetchOpinionsFromAPI(event.id);
          setLocalOpinions(apiOpinions);
        } catch (error) {
          console.error('Error loading opinions:', error);
          setLocalOpinions([]);
        }
      };
      loadOpinions();
    }
  }, [open, event]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setOpinionText("");
      setIsSubmitting(false);
      setShowSuccess(false);
      setLocalOpinions([]);
    }
  }, [open]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleSubmit = async () => {
    if (!opinionText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new opinion with unique ID and timestamp
      const newOpinion = {
        id: generateId(),
        content: opinionText.trim(),
        timestamp: new Date().toISOString(),
        eventId: event.id
      };

      // Add to local state immediately for instant UI update
      const updatedOpinions = [...localOpinions, newOpinion];
      setLocalOpinions(updatedOpinions);
      
      // Submit to API
      await submitOpinionToAPI(event.id, opinionText);
      
      // Call parent handler
      await onSubmit(event.id, opinionText);
      
      setOpinionText("");
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting opinion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpinionText("");
    onClose();
  };

  // Get total opinion count (API opinions + original event opinions)
  const totalOpinions = localOpinions.length + (event?.opinions || 0);

  if (!open || !event) return null;
    
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-500 bg-opacity-50 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{event.location} • {event.date}</p>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              event.status === 'Active' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : event.status === 'Upcoming' 
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {event.status === 'Active' && (
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {event.status || 'Reported'}
            </span>
          </div>

          {/* Existing Opinions */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Opinions ({totalOpinions})
            </h4>
            {totalOpinions > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {/* Show original event opinions first */}
                {event.opinions?.map((opinion, idx) => (
                  <div key={`original-${idx}`} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold text-sm">
                          {getInitials(opinion)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm leading-relaxed">{opinion}</p>
                      <p className="text-gray-400 text-xs mt-1">Original opinion</p>
                    </div>
                  </div>
                ))}
                
                {/* Show local opinions */}
                {localOpinions.map((opinion) => (
                  <div key={opinion.id} className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-blue-800 font-semibold text-sm">
                          {getInitials(opinion.content)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm leading-relaxed">{opinion.content}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {formatTimestamp(opinion.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500">No opinions yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

          {/* Add Opinion Form */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Add Your Opinion</h4>
            <div className="space-y-4">
              <textarea
                value={opinionText}
                onChange={(e) => setOpinionText(e.target.value)}
                placeholder="Share your thoughts about this event..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
                spellCheck={false}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {opinionText.length}/500 characters
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!opinionText.trim() || isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Opinion'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-60 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Opinion submitted successfully!
          </div>
        </div>
      )}
    </div>
  );
}

function Events() {
  const [events, setEvents] = useState(getAllEvents());
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Listen for real-time updates
  useEffect(() => {
    const update = () => setEvents(getAllEvents());
    window.addEventListener("eventsUpdated", update);
    return () => window.removeEventListener("eventsUpdated", update);
  }, []);

  // Handle URL parameter for auto-opening modal
  useEffect(() => {
    const eventIdFromUrl = searchParams.get('eventId');
    if (eventIdFromUrl) {
      // Check if the event exists
      const eventExists = events.find(e => e.id === eventIdFromUrl);
      if (eventExists) {
        setSelectedEventId(eventIdFromUrl);
        // Clear the URL parameter after opening the modal
        setSearchParams({});
      }
    }
  }, [searchParams, events, setSearchParams]);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= now
  );
  const pastEvents = events.filter(
    (e) => new Date(e.date) < now
  );

  // Get total opinions count for an event (including API)
  const getTotalOpinionsForEvent = useCallback(async (eventId) => {
    try {
      const apiOpinions = await fetchOpinionsFromAPI(eventId);
      const event = events.find(e => e.id === eventId);
      return (event?.opinions || 0) + apiOpinions.length;
    } catch (error) {
      console.error('Error getting total opinions:', error);
      const event = events.find(e => e.id === eventId);
      return event?.opinions || 0;
    }
  }, [events]);

  // Memoized opinion submission handler
  const handleAddOpinion = useCallback(async (eventId, opinionText) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update events state immediately to show real-time count change
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            opinions: [...event.opinions, opinionText],
          };
        }
        return event;
      });
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent("eventsUpdated"));
      
      return updatedEvents;
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEventId(null);
  }, []);

  // Enhanced Event Card component
  function EventCard({ event }) {
    const [totalOpinions, setTotalOpinions] = useState(event.opinions || 0);
    
    // Load opinions count when component mounts
    useEffect(() => {
      const loadOpinionsCount = async () => {
        try {
          const count = await getTotalOpinionsForEvent(event.id);
          setTotalOpinions(count);
        } catch (error) {
          console.error('Error loading opinions count:', error);
        }
      };
      loadOpinionsCount();
    }, [event.id, getTotalOpinionsForEvent]);
    
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group hover-lift">
        <div className="p-6">
          {/* Header with status */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
              {event.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ml-2 flex-shrink-0 ${
              event.status === 'Active' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : event.status === 'Upcoming' 
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {event.status === 'Active' && (
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {event.status || 'Reported'}
            </span>
          </div>

          {/* Event details */}
          <div className="space-y-3 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {event.date}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium text-gray-700">
                {totalOpinions} opinion{totalOpinions !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Action button */}
          <button
            onClick={() => setSelectedEventId(event.id)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            View Opinions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Events</h2>
          <p className="text-gray-500">Browse and interact with protest events</p>
        </div>

        {/* Upcoming Events Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Upcoming Events</h3>
            <span className="text-sm text-gray-500">{upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''}</span>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No upcoming events</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for new events</p>
            </div>
          )}
        </div>

        {/* Past Events Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Past Events</h3>
            <span className="text-sm text-gray-500">{pastEvents.length} event{pastEvents.length !== 1 ? 's' : ''}</span>
          </div>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg">No past events</p>
              <p className="text-gray-400 text-sm mt-1">Historical events will appear here</p>
            </div>
          )}
        </div>

        {/* Opinion Modal */}
        <OpinionModal 
          open={!!selectedEventId} 
          onClose={handleCloseModal}
          event={events.find(e => e.id === selectedEventId)}
          onSubmit={handleAddOpinion}
        />
      </div>
    </div>
  );
}

export default Events;
