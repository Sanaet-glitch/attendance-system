import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function StudentLayout() {
  return (
    <div className="drawer drawer-mobile">
      <input id="student-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300 shadow">
          <div className="flex-1 px-2 mx-2 text-xl font-bold">Student Dashboard</div>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
              <li><Link to="/student">Dashboard</Link></li>
              <li><Link to="/student/courses">Courses</Link></li>
              <li><Link to="/student/sessions">Sessions</Link></li>
              {/* More links */}
            </ul>
          </div>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="student-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-200">
          <li><Link to="/student">Dashboard</Link></li>
          <li><Link to="/student/courses">Courses</Link></li>
          <li><Link to="/student/sessions">Sessions</Link></li>
          {/* More sidebar links */}
        </ul>
      </div>
    </div>
  );
}

export default StudentLayout;
