import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="https://www.fifa.com/assets/img/tournaments/17/2018/common/grass_bg.png"
          >
            <source
              src="https://www.fifa.com/assets/video/tournaments/17/2018/common/hero_bg.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-gray-900/50"></div>
        </div>

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 max-w-7xl">
          <div className="text-center">
            <h1 className="space-y-2 font-extrabold text-4xl text-white sm:text-6xl lg:text-7xl">
              <span className="block">Welcome to the</span>
              <span className="block bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent animate-gradient-x">
                FIFA Tournament
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg sm:max-w-3xl text-gray-300 text-xl">
              Join the most exciting FIFA competition platform where players
              compete, connect, and become champions.
            </p>
            <div className="sm:flex sm:justify-center sm:space-x-4 mx-auto mt-10 max-w-sm sm:max-w-none">
              <Link
                to="/leagues"
                className="inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 px-8 py-3 border border-transparent rounded-md w-full sm:w-auto font-medium text-base text-white transform transition-colors duration-200 hover:scale-105"
              >
                View Leagues
              </Link>
              <a
                href="#features"
                className="inline-flex justify-center items-center bg-white hover:bg-gray-50 mt-3 sm:mt-0 px-8 py-3 border border-transparent rounded-md w-full sm:w-auto font-medium text-base text-blue-600 transform transition-colors duration-200 hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="bottom-8 left-1/2 absolute transform -translate-x-1/2">
          <div className="animate-bounce">
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            <h2 className="font-extrabold text-3xl text-white sm:text-4xl">
              Why Choose Our Tournament Platform?
            </h2>
            <p className="mt-4 text-gray-400 text-lg">
              Experience the next level of competitive FIFA gaming
            </p>
          </div>

          <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-20">
            {/* Feature 1 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 opacity-25 group-hover:opacity-100 blur rounded-lg transition animate-tilt duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-800 p-8 rounded-lg">
                <div className="flex justify-center items-center bg-blue-500 rounded-md w-12 h-12 text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 font-medium text-lg text-white">
                  Real-time Matches
                </h3>
                <p className="mt-2 text-base text-gray-400">
                  Experience seamless real-time match tracking and live score
                  updates.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-25 group-hover:opacity-100 blur rounded-lg transition animate-tilt duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-800 p-8 rounded-lg">
                <div className="flex justify-center items-center bg-purple-500 rounded-md w-12 h-12 text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 font-medium text-lg text-white">
                  League Statistics
                </h3>
                <p className="mt-2 text-base text-gray-400">
                  Detailed statistics and analytics for players and leagues.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 opacity-25 group-hover:opacity-100 blur rounded-lg transition animate-tilt duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-800 p-8 rounded-lg">
                <div className="flex justify-center items-center bg-green-500 rounded-md w-12 h-12 text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 font-medium text-lg text-white">
                  Tournament Management
                </h3>
                <p className="mt-2 text-base text-gray-400">
                  Easy-to-use tools for creating and managing tournaments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gray-800">
        <div className="relative h-80 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
              alt="FIFA Stadium"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-900/75 mix-blend-multiply" />
          </div>
          <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 max-w-7xl">
            <h2 className="font-extrabold text-3xl text-white sm:text-4xl tracking-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-6 max-w-3xl text-gray-300 text-lg">
              Join our growing community of FIFA players and compete in exciting
              tournaments.
            </p>
            <div className="mt-10">
              <Link
                to="/leagues"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-3 border border-transparent rounded-md font-medium text-base text-white transform transition-all duration-200 hover:scale-105"
              >
                Join Now
                <svg
                  className="-mr-1 ml-2 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
