import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { registerViews, defaultViews } from "./views/registerViews";
import App from "./App";

registerViews(defaultViews);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
