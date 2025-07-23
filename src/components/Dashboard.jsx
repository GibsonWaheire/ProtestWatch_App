import React from 'react';

const Dashboard = ({ user }) => {
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
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold">Recent Events</h4>
            <a href="#" className="text-sm text-blue-500">View All →</a>
          </div>
          <ul className="text-sm text-gray-700 space-y-2">
            <li><strong>Nairobi CBD Protest</strong> - Nairobi - <span className="text-green-600">Active</span></li>
            <li><strong>Mombasa March</strong> - Mombasa - <span className="text-red-600">Ended</span></li>
            <li><strong>Kisumu Rally</strong> - Kisumu - <span className="text-yellow-600">Pending</span></li>
          </ul>
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

  