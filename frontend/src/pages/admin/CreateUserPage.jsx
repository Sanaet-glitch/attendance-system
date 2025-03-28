import React, { useState } from 'react';

function CreateUserPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('lecturer');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make API call to create user
    console.log('Creating user:', { username, password, role });
    // Show success message or redirect as needed
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="select select-bordered w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="lecturer">Lecturer</option>
          <option value="student">Student</option>
          {/* Admin creation might be restricted */}
        </select>
        <button className="btn btn-primary w-full" type="submit">Create User</button>
      </form>
    </div>
  );
}

export default CreateUserPage;
