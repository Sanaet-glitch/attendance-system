import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function LecturerLayout() {
  return (
    <div className="drawer drawer-mobile">
      <input id="lecturer-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300 shadow">
          <div className="flex-1 px-2 mx-2 text-xl font-bold">Lecturer Dashboard</div>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
              <li><Link to="/lecturer">Dashboard</Link></li>
              <li><Link to="/lecturer/courses">Courses</Link></li>
              <li><Link to="/lecturer/sessions">Sessions</Link></li>
              {/* More links as needed */}
            </ul>
          </div>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="lecturer-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-200">
          <li><Link to="/lecturer">Dashboard</Link></li>
          <li><Link to="/lecturer/courses">Courses</Link></li>
          <li><Link to="/lecturer/sessions">Sessions</Link></li>
          {/* More sidebar links */}
        </ul>
      </div>
    </div>
  );
}

export default LecturerLayout;
