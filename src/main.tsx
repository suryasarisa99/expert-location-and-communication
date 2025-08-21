import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import "./layout.scss";
import { BrowserRouter } from "react-router-dom";
import DataProvider from "@context/Data/DataContext";
// import { registerSW } from "virtual:pwa-register";
// registerSW();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <DataProvider>
      <App />
    </DataProvider>
  </BrowserRouter>
);
