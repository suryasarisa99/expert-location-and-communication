import ChatList from "@components/ChatList";
import ChatSection from "@components/ChatSection";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import "./home.scss";
import SideBar from "@components/SideBar";

export default function Chat() {
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

  return (
    <div className={"home " + (isLgScreen ? "lg-screen" : "sm-screen")}>
      {(isLgScreen ||
        (!isLgScreen && location.pathname.replaceAll("/", "") === "chat")) && (
        <>
          <SideBar isLgScreen={isLgScreen} />
          <ChatList
            selectChat={(chatId) => {
              if (location.pathname === "/chat") navigate("/chat/" + chatId);
              else navigate("/chat/" + chatId, { replace: true });
            }}
            isLgScreen={isLgScreen}
            scrollAmount={chatListScrollRef.current}
            setScrollAmount={(scrollAmount) => {
              chatListScrollRef.current = scrollAmount;
            }}
          />
        </>
      )}
      <Routes>
        <Route path="/:id" element={<ChatSection />} />
      </Routes>
    </div>
  );
}
