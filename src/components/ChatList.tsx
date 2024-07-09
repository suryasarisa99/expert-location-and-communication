import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { FaUser } from "react-icons/fa";

type ChatListProps = {
  isLgScreen: boolean;
  selectChat: (id: string) => void;
  scrollAmount: number;
  setScrollAmount: (scrollAmount: number) => void;
};

export default function ChatList({
  isLgScreen,
  selectChat,
  scrollAmount,
  setScrollAmount,
}: ChatListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollDivRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState("");

  console.log(userId);
  useEffect(() => {
    setUserId(location.pathname.split("/")[2]);
  }, [location.pathname]);

  useLayoutEffect(() => {
    console.log(" in layout effect");
    if (!scrollDivRef.current) {
      console.log("scroll skipped");
      return;
    }
    console.log("may be scrolled");
    scrollDivRef.current.scrollTo({ top: scrollAmount });
    return () => {
      console.log(scrollDivRef.current?.scrollTop);
      setScrollAmount(scrollDivRef.current?.scrollTop || 0);
    };
  }, []);

  return (
    <div
      className={"chat-list " + (isLgScreen ? "lg-screen" : "sm-screen")}
      ref={scrollDivRef}
    >
      {Array.from({ length: 50 }).map((_, i) => {
        return (
          <div
            key={i}
            onClick={() => selectChat(i.toString())}
            className={
              "chat-list-item " + (userId === i.toString() ? "active" : "")
            }
          >
            {/* <img src="" alt={`profile-img-${i}`} /> */}
            <div className="icon-outer">
              <FaUser />
            </div>
            <div className="chat-item-column">
              <div className="top-row">
                <p className="user-name"> User {i}</p>
                <p className="time">12:00</p>
              </div>
              <p className="last-mssg">This is the Last Message {i}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
