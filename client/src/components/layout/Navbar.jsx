
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  CalendarDays,
  History,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const links = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/payments",
      label: "Payments",
      icon: CreditCard,
    },
    {
      to: "/calendar",
      label: "Calendar",
      icon: CalendarDays,
    },
    {
      to: "/history",
      label: "History",
      icon: History,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="text-xl font-bold text-gray-900"
        >
          SubTrack
        </NavLink>

        {isAuthenticated ? (
          <>
            {/* Authenticated navigation */}
            <div className="flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <Icon size={17} />

                    <span className="hidden sm:inline">
                      {link.label}
                    </span>
                  </NavLink>
                );
              })}

              {/* User section */}
              <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={17} />

                  <span className="hidden sm:inline">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Public navigation */
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <LogIn size={17} />
              <span>Log in</span>
            </NavLink>

            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`
              }
            >
              <UserPlus size={17} />
              <span>Sign up</span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
