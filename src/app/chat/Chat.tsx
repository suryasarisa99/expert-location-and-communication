import ChatList from "@app/chat/ChatList";
import ChatSection from "@app/chat/ChatSection";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import SideBar from "@components/SideBar";
import SearchSection from "../search/SearchSection";
import Popup from "@components/Popup";
import useData from "@hooks/useData";
import "./chat.scss";

export default function Chat({ isLgScreen }: { isLgScreen: boolean }) {
  const location = useLocation();

  const chatListScrollRef = useRef(0.0);
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const { role } = useData();

  return (
    <
      // className={"home-page page " + (isLgScreen ? "lg-screen" : "sm-screen")}
    >
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
      <div className="container-page">
        {(isLgScreen ||
          (!isLgScreen &&
            location.pathname.replaceAll("/", "") === "chat")) && (
          <>
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
          <Route
            path="/:id"
            element={<ChatSection isLgScreen={isLgScreen} />}
          />
          <Route path="/:id/profile" element={<SearchSection />} />
        </Routes>
      </div>
    </>
  );
}
