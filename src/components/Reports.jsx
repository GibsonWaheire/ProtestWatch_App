// src/components/Report.jsx
import React, { useState } from "react";

const INCIDENT_TYPES = [
  "Protest",
  "Meeting",
  "Alert",
  "Other"
];
const COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Uasin Gishu",
  "Kiambu",
  "Machakos",
  "Other"
];

const initialForm = {
  eventTitle: "",
  eventType: "",
  county: "",
  specificLocation: "",
  date: "",
  time: "",
  description: "",
  reporterName: "",
  reporterContact: ""
};

function ReportForm() {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setForm(initialForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Compose new event object for Events/Dashboard
    const newEvent = {
      id: Date.now(),
      title: form.eventTitle,
      type: form.eventType,
      county: form.county,
      location: form.specificLocation,
      date: form.date,
      time: form.time,
      description: form.description,
      reporterName: form.reporterName,
      reporterContact: form.reporterContact,
      status: "Active",
      opinions: []
    };
    // Save to localStorage
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    events.unshift(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    // Notify other components
    window.dispatchEvent(new Event("eventsUpdated"));
    window.dispatchEvent(new CustomEvent("showAlert", { detail: { type: "success", message: "Incident report submitted!" } }));
    setForm(initialForm);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">ProtestWatch Incident Report Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Incident Details Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Incident Details <span className="text-red-500">*</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div className="col-span-1">
              <label className="block font-medium mb-1 text-gray-700">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="eventTitle"
                value={form.eventTitle}
                onChange={handleChange}
                placeholder="Brief descriptive title of the event"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Event Type */}
            <div className="col-span-1">
              <label className="block font-medium mb-1 text-gray-700">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled>Select event type</option>
                {INCIDENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {/* County */}
            <div className="col-span-1">
              <label className="block font-medium mb-1 text-gray-700">
                County <span className="text-red-500">*</span>
              </label>
              <select
                name="county"
                value={form.county}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled>Select county</option>
                {COUNTIES.map((county) => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>
            {/* Specific Location */}
            <div className="col-span-1">
              <label className="block font-medium mb-1 text-gray-700">
                Specific Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="specificLocation"
                value={form.specificLocation}
                onChange={handleChange}
                placeholder="e.g., Freedom Corner, Uhuru Park"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Date */}
            <div className="col-span-1">
              <label className="block font-medium mb-1 text-gray-700">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Time */}
            <div className="col-span-1">
              <label className="block font-medium mb-1 text-gray-700">
                Time (approximate) <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block font-medium mb-1 text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of what happened, including context and key details"
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              ></textarea>
            </div>
          </div>
        </section>
        {/* Reporter Information Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Reporter Information <span className="text-gray-400">(Optional)</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reporter Name */}
            <div className="col-span-1">
              <label className="block font-medium mb-1 text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                name="reporterName"
                value={form.reporterName}
                onChange={handleChange}
                placeholder="Your name or organization"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Reporter Contact */}
            <div className="col-span-1">
              <label className="block font-medium mb-1 text-gray-700">
                Contact (Email/Phone)
              </label>
              <input
                type="text"
                name="reporterContact"
                value={form.reporterContact}
                onChange={handleChange}
                placeholder="Email or phone number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </section>
        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="border border-blue-600 text-blue-700 px-6 py-2 rounded-md font-semibold hover:bg-blue-50 transition"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-700 transition"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportForm;

  