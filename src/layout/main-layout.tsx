import { Link, Outlet, useLocation } from "react-router-dom";
import { useAdmin } from "../hooks/use-admin";
import { Drawer, Modal, Button, Avatar } from "antd";
import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";

const MainLayout = () => {
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 min-h-screen">
      {/* Animated Background Pattern */}
      <div className="z-0 fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/soccer.png')] animate-slide-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="top-0 z-50 sticky border-gray-700 bg-gray-800/80 backdrop-blur-lg border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-10 h-10 transform hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold text-transparent text-xl">
                FIFA Tournament
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="md:flex items-center space-x-4 hidden">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  location.pathname === "/"
                    ? "text-white bg-gray-900 shadow-lg shadow-blue-500/20"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                Home
              </Link>
              <Link
                to="/leagues"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  location.pathname === "/leagues"
                    ? "text-white bg-gray-900 shadow-lg shadow-blue-500/20"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                Leagues
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    location.pathname === "/admin"
                      ? "text-white bg-gray-900 shadow-lg shadow-purple-500/20"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transform transition-all duration-200 hover:scale-105">
                <Avatar
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                  size="small"
                >
                  U
                </Avatar>
                <span className="sm:inline hidden text-white">User</span>
              </button>

              <button
                className="md:hidden hover:bg-gray-700 p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuOutlined className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-8 h-8">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg">FIFA Tournament</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="bg-gray-900"
        styles={{
          header: {
            background: "#1f2937",
            borderBottom: "1px solid #374151",
          },
          body: {
            background: "#111827",
            padding: 0,
          },
        }}
      >
        <div className="flex flex-col py-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-3 text-base font-medium transition-colors duration-200 ${
              location.pathname === "/"
                ? "text-white bg-gray-800"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Home
          </Link>
          <Link
            to="/leagues"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-3 text-base font-medium transition-colors duration-200 ${
              location.pathname === "/leagues"
                ? "text-white bg-gray-800"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Leagues
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 text-base font-medium transition-colors duration-200 ${
                location.pathname === "/admin"
                  ? "text-white bg-gray-800"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Admin
            </Link>
          )}
        </div>
      </Drawer>

      {/* Profile Modal */}
      <Modal
        title="User Profile"
        open={profileModalOpen}
        onCancel={() => setProfileModalOpen(false)}
        footer={null}
        className="profile-modal"
        styles={{
          header: {
            background: "#1f2937",
            borderBottom: "1px solid #374151",
            borderRadius: "8px 8px 0 0",
          },
          content: {
            background: "#111827",
            borderRadius: "8px",
          },
          body: {
            padding: "24px",
          },
        }}
      >
        <div className="flex flex-col items-center space-y-4 py-6">
          <Avatar
            size={80}
            className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
          >
            U
          </Avatar>
          <h3 className="font-semibold text-white text-xl">User Name</h3>
          <p className="text-gray-400">user@example.com</p>
          <div className="space-y-4 mt-6 w-full">
            <Button
              type="default"
              className="border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700 w-full text-white"
            >
              Edit Profile
            </Button>
            <Button type="primary" danger className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>

      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-gray-700 bg-gray-800/80 backdrop-blur-lg mt-auto border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-semibold text-lg text-white">
                FIFA Tournament
              </h3>
              <p className="text-gray-400 text-sm">
                Experience the thrill of competitive FIFA gaming with our
                tournament platform.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-lg text-white">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block text-gray-400 text-sm hover:text-white"
                >
                  Home
                </Link>
                <Link
                  to="/leagues"
                  className="block text-gray-400 text-sm hover:text-white"
                >
                  Leagues
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-gray-400 text-sm hover:text-white"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-lg text-white">Connect</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-gray-700 mt-8 pt-8 border-t text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FIFA Tournament. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
