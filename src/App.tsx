import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/app-layout";
import League from "./pages/league";
import Home from "./pages/home";
import Admin from "./pages/admin";
import LeaguePage from "./pages/league-page";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/league",
          element: <League />,
        },
        {
          path: "/league/:id",
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
