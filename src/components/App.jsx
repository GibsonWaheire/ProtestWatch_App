// src/components/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Dashboard from './Dashboard.jsx';
import Events from './Events.jsx';
import Report from './Reports.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { useState } from 'react';
import Alert from './Alert.jsx';
import ReportForm from './Reports.jsx';
import React from 'react';

function App() {
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Listen for showAlert events
  React.useEffect(() => {
    const handler = (e) => {
      if (e.detail && e.detail.message) {
        setAlertMsg(e.detail.message);
        setShowAlert(true);
      }
    };
    window.addEventListener("showAlert", handler);
    return () => window.removeEventListener("showAlert", handler);
  }, []);

  const handleAlertClose = () => setShowAlert(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {showAlert && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            <Alert message={alertMsg} onClose={handleAlertClose} />
          </div>
        )}
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/login" element={<Login setAlertMsg={setAlertMsg} />} />
            <Route path="/register" element={<Register setAlertMsg={setAlertMsg} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

