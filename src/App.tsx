import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/main-layout";
import HomePage from "./pages/home-page";
import LeaguesPage from "./pages/leagues-page";
import LeaguePage from "./pages/league-page";
import Admin from "./pages/admin";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/leagues",
          element: <LeaguesPage />,
        },
        {
          path: "/leagues/:id",
          element: <LeaguePage />,
        },
        {
          path: "/admin",
          element: <Admin />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
