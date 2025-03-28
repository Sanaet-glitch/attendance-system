import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="drawer drawer-mobile">
      {/* Sidebar */}
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300 shadow">
          <div className="flex-1 px-2 mx-2 text-xl font-bold">Admin Dashboard</div>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
              <li><Link to="/admin">Dashboard</Link></li>
              <li><Link to="/admin/create-user">Create User</Link></li>
              {/* Add more admin navigation links as needed */}
            </ul>
          </div>
        </div>
        {/* Main content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-200">
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/create-user">Create User</Link></li>
          {/* More sidebar links */}
        </ul>
      </div>
    </div>
  );
}

export default AdminLayout;
