import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AdminContextProvider from "./context/admin-context.tsx";

createRoot(document.getElementById("root")!).render(
  <AdminContextProvider>
    <App />
  </AdminContextProvider>
);
