import React, { useEffect, useState } from 'react';
import eventsData from '../data/events.json';
import { Link, useNavigate } from 'react-router-dom';

function getAllEvents() {
  const local = JSON.parse(localStorage.getItem("events") || "[]");
  const staticEvents = eventsData.map(e => ({ ...e, opinions: e.opinions || [] }));
  const all = [...local, ...staticEvents.filter(e => !local.some(ev => ev.id === e.id))];
  return all;
}

// Helper to get opinions from API
const API_BASE_URL = 'http://localhost:4000/api';

async function getOpinionsFromAPI(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/opinions/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch opinions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading opinions from API:', error);
    return [];
  }
}

// Dashboard Event Card Component
function DashboardEventCard({ event, onCardClick, getTotalOpinionsForEvent }) {
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
    <div 
      className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => onCardClick(event.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <h5 className="font-semibold text-blue-900 text-sm leading-tight line-clamp-2">
          {event.title || event.name}
        </h5>
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
      
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.location}
        </div>
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {event.date || event.datetime?.split('T')[0]}
        </div>
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium text-gray-700">
            {totalOpinions} opinion{totalOpinions !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 text-xs mt-3 line-clamp-2 leading-relaxed">
        {event.description}
      </p>
      
      {/* Click indicator */}
      <div className="mt-3 pt-2 border-t border-blue-200">
        <div className="flex items-center justify-between text-xs text-blue-600">
          <span>Click to view details</span>
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const Dashboard = ({ user }) => {
  const [events, setEvents] = useState(getAllEvents());
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => setEvents(getAllEvents());
    window.addEventListener("eventsUpdated", update);
    return () => window.removeEventListener("eventsUpdated", update);
  }, []);

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      if (filterStatus === 'all') return true;
      return event.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date || a.datetime || 0);
        const dateB = new Date(b.date || b.datetime || 0);
        return dateB - dateA;
      }
      if (sortBy === 'title') {
        return (a.title || a.name || '').localeCompare(b.title || b.name || '');
      }
      return 0;
    });

  // Get total opinions count for an event (including API)
  const getTotalOpinionsForEvent = async (eventId) => {
    try {
      const apiOpinions = await getOpinionsFromAPI(eventId);
      const event = events.find(e => e.id === eventId);
      return (event?.opinions || 0) + apiOpinions.length;
    } catch (error) {
      console.error('Error getting total opinions:', error);
      const event = events.find(e => e.id === eventId);
      return event?.opinions || 0;
    }
  };

  // Handle event card click - navigate to Events page with event ID
  const handleEventCardClick = (eventId) => {
    navigate(`/events?eventId=${eventId}`);
  };

  // Trending hashtags data with trend indicators
  const trendingHashtags = [
    { tag: '#JusticeNow', count: '1.2k', trend: 'up', change: '+15%' },
    { tag: '#NjaaRevolution', count: '950', trend: 'up', change: '+8%' },
    { tag: '#HakiYetu', count: '860', trend: 'down', change: '-3%' },
    { tag: '#TaxProtest', count: '820', trend: 'up', change: '+12%' },
    { tag: '#Maandamano', count: '780', trend: 'up', change: '+6%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          {user && <p className="text-gray-600 mb-1">Welcome back, {user.email}</p>}
          <p className="text-gray-500">Quick overview of protest activity and trends</p>
        </div>

        {/* Stats Cards - Enhanced with consistent sizing and better visual hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 animate-fade-in-up hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +5%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Protests</h3>
            <p className="text-3xl font-bold text-gray-900">18</p>
            <p className="text-green-600 text-sm mt-2 group relative">
              +5% this week
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Compared to last week's total
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
              </span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 animate-fade-in-up hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <span className="text-red-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                -2%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Recent Arrests</h3>
            <p className="text-3xl font-bold text-gray-900">6</p>
            <p className="text-red-600 text-sm mt-2 group relative">
              -2% this week
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Decrease from last week's arrests
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
              </span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 animate-fade-in-up hover-lift" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +3
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Active Events</h3>
            <p className="text-3xl font-bold text-gray-900">4</p>
            <p className="text-green-600 text-sm mt-2 group relative">
              +3 new today
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                New events reported today
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
              </span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 animate-fade-in-up hover-lift" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +12%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Reports</h3>
            <p className="text-3xl font-bold text-gray-900">32</p>
            <p className="text-green-600 text-sm mt-2 group relative">
              +12% this week
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Increase in user reports this week
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
              </span>
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Events Section - Enhanced */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-semibold text-gray-900">Recent Events</h4>
                <Link 
                  to="/events" 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  View All
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {/* Filter and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Filter:</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Events</option>
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ended">Ended</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>

              {filteredAndSortedEvents.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500">No events found with the selected filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredAndSortedEvents.slice(0, 6).map(ev => (
                    <DashboardEventCard 
                      key={ev.id} 
                      event={ev} 
                      onCardClick={handleEventCardClick}
                      getTotalOpinionsForEvent={getTotalOpinionsForEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trending Hashtags Section - Enhanced */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="p-6 border-b border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 text-center">Trending Hashtags</h4>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {trendingHashtags.map((hashtag, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">{hashtag.tag}</span>
                      <span className="text-xs text-gray-500">{hashtag.count}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${
                        hashtag.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {hashtag.change}
                      </span>
                      <svg className={`w-4 h-4 ${
                        hashtag.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        {hashtag.trend === 'up' ? (
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full py-2 px-4 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  View All Trends
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

  