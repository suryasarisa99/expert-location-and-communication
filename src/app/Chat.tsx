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
import SearchSection from "./search/SearchSection";
import Popup from "@components/Popup";
import useData from "@hooks/useData";

export default function Chat() {
  const largeScreenSize = 768;
  const location = useLocation();
  const [isLgScreen, setIsLgScreen] = useState(
    window.innerWidth > largeScreenSize
  );
  const chatListScrollRef = useRef(0.0);
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const { role } = useData();

  useEffect(() => {
    function handleResize() {
      setIsLgScreen(window.innerWidth > largeScreenSize);
    }
    // if (role == -1) navigate("/signin");
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={"home " + (isLgScreen ? "lg-screen" : "sm-screen")}>
      <Popup
        show={popup}
        handleClose={() => setPopup(false)}
        closeOnEscape={true}
        closeOnClickOutside={true}
        className="popup-top"
      >
        <div>
          <div className="popup-content">
            <h1>Popup</h1>
            <p>Popup content</p>
            <button
              onClick={(e) => {
                // e.preventDefault();
                // setPopup(false);
              }}
            >
              Test
            </button>
          </div>
        </div>
      </Popup>
      {(isLgScreen ||
        (!isLgScreen && location.pathname.replaceAll("/", "") === "chat")) && (
        <>
          {/* <SideBar isLgScreen={isLgScreen} /> */}
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
        <Route path="/:id/profile" element={<SearchSection />} />
      </Routes>
    </div>
  );
}
