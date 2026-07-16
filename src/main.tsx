import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AdminProvider } from "./admin/AdminContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminProvider>
      <App />
    </AdminProvider>
  </StrictMode>,
);
