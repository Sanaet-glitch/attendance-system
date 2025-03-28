import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setToken } from '../api'; // Adjust the path as necessary

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      const user = res.data.user;
      // Store user info in localStorage (you can use context or other state management as well)
      localStorage.setItem('user', JSON.stringify(user));
      // Set the token for axios to use in subsequent requests
      setToken(res.data.token);
      // Redirect based on user role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'lecturer') navigate('/lecturer');
      else if (user.role === 'student') navigate('/student');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form onSubmit={handleLogin} className="p-6 shadow-lg rounded-lg bg-base-100">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered w-full mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
