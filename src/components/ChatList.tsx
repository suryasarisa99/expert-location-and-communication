import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import useData from "@hooks/useData";
import { motion } from "framer-motion";

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
  const { data, role, currentTutor } = useData();

  useEffect(() => {
    setUserId(location.pathname.split("/")[2]);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (!scrollDivRef.current) return;

    scrollDivRef.current.scrollTo({ top: scrollAmount });
    return () => {
      setScrollAmount(scrollDivRef.current?.scrollTop || 0);
    };
  }, []);

  return (
    <div className="chat-sidebar">
      <div className="chat-header">
        <div className="title">
          @{role == 1 ? data?._id : currentTutor?._id}
        </div>
        <div className="search-icon">
          <FaSearch />
        </div>
      </div>
      <div
        className={"chat-list " + (isLgScreen ? "lg-screen" : "sm-screen")}
        ref={scrollDivRef}
      >
        {(role == 1
          ? data?.tutors
          : currentTutor?.requests?.filter((x) => x.status == "accepted")
        )?.map((user, i) => {
          return (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              key={i}
              onClick={() => selectChat(user._id)}
              className={
                "chat-list-item " + (userId === user._id ? "active" : "")
              }
            >
              {/* <img src="" alt={`profile-img-${i}`} /> */}
              <div className="icon-outer">
                <FaUser />
              </div>
              <div className="chat-item-column">
                <div className="top-row">
                  <p className="user-name">{user.name}</p>
                  {/* <p className="time">{user.lastTime}</p> */}
                </div>
                <p className="last-mssg">@{user._id}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
