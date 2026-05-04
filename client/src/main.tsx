import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * =========================
 * ROOT ELEMENT SAFETY
 * =========================
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element (#root) not found in HTML");
}

/**
 * =========================
 * RENDER APP
 * =========================
 */
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);