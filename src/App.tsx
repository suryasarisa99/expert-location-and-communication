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
import ImageCrop from "@components/ImageCrop";
import ImageCrop2 from "@components/ImageCrop2";
import ProfilePage from "@app/profile/ProfilePage";
import UploadPage from "@app/upload/UploadPage";
import Posts from "@app/Posts";

export default function App() {
  const largeScreenSize = 768;
  const location = useLocation();
  const [isLgScreen, setIsLgScreen] = useState(
    window.innerWidth > largeScreenSize
  );

  useEffect(() => {
    function handleResize() {
      setIsLgScreen(window.innerWidth > largeScreenSize);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const NegltedScreens = ["/", "/signin", "/image-crop"];

  const isNegletedScreen = NegltedScreens.includes(location.pathname);
  const isSmallScreenAndNotSelectedChat =
    !isLgScreen &&
    [
      "/chat",
      "/search",
      "/notifications",
      "/settings",
      "/upload",
      "/posts",
      "/profile",
    ].includes(location.pathname);

  return (
    <div className="app">
      {!isNegletedScreen && (isLgScreen || isSmallScreenAndNotSelectedChat) && (
        <SideBar isLgScreen={isLgScreen} />
      )}
      <div className="routes">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/chat/*" element={<Chat isLgScreen={isLgScreen} />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/posts" element={<Posts />} />
          {/* <Route path="/image-crop" element={<ImageCrop2 />} /> */}
          <Route
            path="/search/*"
            element={<SearchPage isLgScreen={isLgScreen} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage isLgScreen={isLgScreen} />}
          />
        </Routes>
      </div>
    </div>
  );
}
