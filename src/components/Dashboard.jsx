import React, { useEffect, useState } from 'react';
import eventsData from '../data/events.json';
import { Link } from 'react-router-dom';

function getAllEvents() {
  const local = JSON.parse(localStorage.getItem("events") || "[]");
  const staticEvents = eventsData.map(e => ({ ...e, opinions: e.opinions || [] }));
  const all = [...local, ...staticEvents.filter(e => !local.some(ev => ev.id === e.id))];
  return all;
}

const Dashboard = ({ user }) => {
  const [events, setEvents] = useState(getAllEvents());

  useEffect(() => {
    const update = () => setEvents(getAllEvents());
    window.addEventListener("eventsUpdated", update);
    return () => window.removeEventListener("eventsUpdated", update);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {user && <p className="mb-2 text-gray-500">Welcome, {user.email}</p>}
      <p className="text-gray-600 mb-8">Quick overview of protest activity</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Total Protests</h3>
          <p className="text-2xl font-bold text-indigo-600">18</p>
          <p className="text-green-600 text-sm">+5% this week</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Recent Arrests</h3>
          <p className="text-2xl font-bold text-indigo-600">6</p>
          <p className="text-red-600 text-sm">-2% this week</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Active Events</h3>
          <p className="text-2xl font-bold text-indigo-600">4</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Total Reports</h3>
          <p className="text-2xl font-bold text-indigo-600">32</p>
          <p className="text-green-600 text-sm">+12% this week</p>
        </div>
      </div>

      {/* Panels: Recent Events & Trending Hashtags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Recent Events</h4>
            <Link to="/events" className="text-sm text-blue-500 hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.length === 0 ? (
              <div className="text-gray-400">No events yet.</div>
            ) : (
              events.slice(0, 5).map(ev => (
                <div key={ev.id} className="bg-blue-50 border border-blue-200 rounded-xl shadow p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700 text-lg">{ev.title || ev.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ev.status === 'Active' ? 'bg-green-100 text-green-700' : ev.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>{ev.status || 'Reported'}</span>
                  </div>
                  <div className="text-gray-600 text-sm">{ev.location}</div>
                  <div className="text-gray-400 text-xs">{ev.date || ev.datetime?.split('T')[0]}</div>
                  <div className="truncate text-gray-700 text-sm">{ev.description}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-2">Trending Hashtags</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>#JusticeNow – 1.2k 🔼</li>
            <li>#NjaaRevolution – 950 🔼</li>
            <li>#HakiYetu – 860 🔽</li>
            <li>#TaxProtest – 820 🔼</li>
            <li>#Maandamano – 780 🔼</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

  