import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const linkClass = "block px-2 py-2 rounded hover:bg-indigo-500 md:hover:bg-transparent md:hover:underline md:px-0 md:py-0";

  return (
    <nav className="bg-indigo-600 dark:bg-gray-900 text-white shadow relative z-50">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg md:text-xl font-bold" onClick={() => setOpen(false)}>
          AI Resume Builder
        </Link>

        {/* Theme toggle + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            className="p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="text-lg">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className={linkClass}>Dashboard</Link>
              <Link to="/resume" className={linkClass}>Resume Builder</Link>
              <Link to="/jobs" className={linkClass}>Job Tracker</Link>
              <Link to="/settings" className={linkClass}>Settings</Link>
              <span className="text-sm opacity-80 whitespace-nowrap">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-3 py-1 rounded font-medium hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Login</Link>
              <Link to="/register" className={linkClass}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1 bg-indigo-600 border-t border-indigo-500">
          {user ? (
            <>
              <Link to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/resume" className={linkClass} onClick={() => setOpen(false)}>Resume Builder</Link>
              <Link to="/jobs" className={linkClass} onClick={() => setOpen(false)}>Job Tracker</Link>
              <Link to="/settings" className={linkClass} onClick={() => setOpen(false)}>Settings</Link>
              <span className="text-sm opacity-80 px-2 py-2">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-3 py-2 rounded font-medium hover:bg-gray-100 mt-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass} onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className={linkClass} onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
