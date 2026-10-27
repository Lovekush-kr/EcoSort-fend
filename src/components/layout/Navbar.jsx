import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, ScanLine } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate('/');
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary-700 bg-primary-50'
        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/Group 6.svg"
              alt="EcoSort AI Logo"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold text-gray-900">
              Eco<span className="text-primary-600">Sort</span>
              <span className="text-secondary-500 text-sm font-medium ml-1">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/scanner" className={linkClass}>Scanner</NavLink>
            <NavLink to="/history" className={linkClass}>History</NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/scanner"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
            >
              <ScanLine className="w-4 h-4" />
              Scan Waste
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  <User className="w-4 h-4 inline mr-1" />
                  {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-3 space-y-1">
            <NavLink to="/" className={linkClass} end onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/scanner" className={linkClass} onClick={() => setMobileOpen(false)}>
              Scanner
            </NavLink>
            <NavLink to="/history" className={linkClass} onClick={() => setMobileOpen(false)}>
              History
            </NavLink>

            <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass} onClick={() => setMobileOpen(false)}>
                    Login
                  </NavLink>
                  <NavLink to="/register" className={linkClass} onClick={() => setMobileOpen(false)}>
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

