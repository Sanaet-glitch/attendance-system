import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  login,
  createUser,
  createCourse,
  enrollInCourse,
  createSession,
  broadcastLocation,
  markAttendance,
  default as api,
} from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const res = await login({ username, password });
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      api.setToken(newToken);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    api.setToken('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <Link to="/" className="mr-4">Home</Link>
        {token && <Link to="/dashboard" className="mr-4">Dashboard</Link>}
        {token && (
          <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded">
            Logout
          </button>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
      </Routes>
    </div>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full p-2 mb-4 border rounded"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        onClick={() => onLogin(username, password)}
      >
        Login
      </button>
    </div>
  );
}

function Dashboard({ token }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [courseTitle, setCourseTitle] = useState('');
  const [enrollmentKey, setEnrollmentKey] = useState('');
  const [sessionData, setSessionData] = useState({
    courseId: '',
    startTime: '',
    endTime: '',
  });

  const handleCreateUser = async () => {
    try {
      await createUser({ username, password, role });
      alert('User created');
    } catch (err) {
      alert('User creation failed');
    }
  };

  const handleCreateCourse = async () => {
    try {
      const res = await createCourse({ title: courseTitle });
      alert(`Course created with key: ${res.data.enrollmentKey}`);
    } catch (err) {
      alert('Course creation failed');
    }
  };

  const handleEnroll = async () => {
    try {
      await enrollInCourse({ enrollmentKey });
      alert('Enrolled in course');
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  const handleCreateSession = async () => {
    try {
      const res = await createSession(sessionData);
      alert(`Session created with ID: ${res.data._id}`);
    } catch (err) {
      alert('Session creation failed');
    }
  };

  const handleBroadcast = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        await broadcastLocation(sessionData.courseId, { lat: latitude, lng: longitude, proximityRange: 50 });
        alert('Location broadcasted');
      } catch (err) {
        alert('Broadcast failed');
      }
    });
  };

  const handleAttendance = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        await markAttendance(sessionData.courseId, { lat: latitude, lng: longitude });
        alert('Attendance marked');
      } catch (err) {
        alert('Attendance marking failed');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl mb-2">Admin: Create User</h2>
        <input
          className="p-2 border rounded mr-2"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="p-2 border rounded mr-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <select className="p-2 border rounded mr-2" onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="lecturer">Lecturer</option>
          <option value="student">Student</option>
        </select>
        <button
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          onClick={handleCreateUser}
        >
          Create User
        </button>
      </section>

      <section className="mb-6">
        <h2 className="text-xl mb-2">Lecturer: Create Course</h2>
        <input
          className="p-2 border rounded mr-2"
          placeholder="Course Title"
          onChange={(e) => setCourseTitle(e.target.value)}
        />
        <button
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          onClick={handleCreateCourse}
        >
          Create Course
        </button>
      </section>

      <section className="mb-6">
        <h2 className="text-xl mb-2">Student: Enroll in Course</h2>
        <input
          className="p-2 border rounded mr-2"
          placeholder="Enrollment Key"
          onChange={(e) => setEnrollmentKey(e.target.value)}
        />
        <button
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          onClick={handleEnroll}
        >
          Enroll
        </button>
      </section>

      <section className="mb-6">
        <h2 className="text-xl mb-2">Lecturer: Create Session</h2>
        <input
          className="p-2 border rounded mr-2"
          placeholder="Course ID"
          onChange={(e) =>
            setSessionData({ ...sessionData, courseId: e.target.value })
          }
        />
        <input
          className="p-2 border rounded mr-2"
          type="datetime-local"
          onChange={(e) =>
            setSessionData({ ...sessionData, startTime: e.target.value })
          }
        />
        <input
          className="p-2 border rounded mr-2"
          type="datetime-local"
          onChange={(e) =>
            setSessionData({ ...sessionData, endTime: e.target.value })
          }
        />
        <button
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          onClick={handleCreateSession}
        >
          Create Session
        </button>
      </section>

      <section className="mb-6">
        <h2 className="text-xl mb-2">Lecturer: Broadcast Location</h2>
        <input
          className="p-2 border rounded mr-2"
          placeholder="Session ID"
          onChange={(e) =>
            setSessionData({ ...sessionData, courseId: e.target.value })
          }
        />
        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={handleBroadcast}
        >
          Broadcast
        </button>
      </section>

      <section>
        <h2 className="text-xl mb-2">Student: Mark Attendance</h2>
        <input
          className="p-2 border rounded mr-2"
          placeholder="Session ID"
          onChange={(e) =>
            setSessionData({ ...sessionData, courseId: e.target.value })
          }
        />
        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={handleAttendance}
        >
          Mark Attendance
        </button>
      </section>
    </div>
  );
}

export default App;
