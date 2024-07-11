import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./colors.css";
import Chat from "@app/Chat";
import Signup from "@app/auth/Signup";
import { GiSkills } from "react-icons/gi";
import Signin from "@app/auth/Signin";
import SideBar from "@components/SideBar";
import SearchPage from "@app/search/SearchPage";
import Notifications from "@app/Notifications";

export default function App() {
  const largeScreenSize = 768;
  const location = useLocation();
  const [isLgScreen, setIsLgScreen] = useState(
    window.innerWidth > largeScreenSize
  );
  const chatListScrollRef = useRef(0.0);
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      setIsLgScreen(window.innerWidth > largeScreenSize);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAuthScreens =
    location.pathname === "/" || location.pathname === "/signin";
  const isSmallScreenAndNotSelectedChat =
    !isLgScreen &&
    ["/chat", "/search", "/notifications", "/settings"].includes(
      location.pathname
    );

  return (
    <div className="app">
      {!isAuthScreens && (isLgScreen || isSmallScreenAndNotSelectedChat) && (
        <SideBar isLgScreen={isLgScreen} />
      )}
      <div className="routes">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/chat/*" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/search/*"
            element={<SearchPage isLgScreen={isLgScreen} />}
          />
        </Routes>
      </div>
    </div>
  );
}
