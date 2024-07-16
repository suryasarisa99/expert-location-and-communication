import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaUser, FaUserTie } from "react-icons/fa";
import useData from "@hooks/useData";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import Popup from "./Popup";
import ImgPopup from "./ImgPopup";
import Fuse from "fuse.js";
import { TutorSearchType } from "@src/types/StudentType";

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
  const { data, role, currentTutor, users } = useData();
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [imgLocation, setImgLocation] = useState({ x: 0, y: 0, i: -1 });
  const [query, setQuery] = useState("");
  const [showSearchBar, setShowSearchPage] = useState(false);

  useEffect(() => {
    setUserId(location.pathname.split("/")[2]);
  }, [location.pathname]);
  const userSearchRef = useRef<Fuse<TutorSearchType>>();

  // useEffect(() => {
  //   const requestUserLocation = () => {
  //     if ("geolocation" in navigator) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const l = {
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //           };
  //         },
  //         (error) => {
  //           console.error("Error obtaining location:", error);
  //         }
  //       );
  //     } else {
  //       console.log("Geolocation is not supported by this browser.");
  //     }
  //   };

  //   requestUserLocation();
  // });

  useLayoutEffect(() => {
    if (!scrollDivRef.current) return;

    scrollDivRef.current.scrollTo({ top: scrollAmount });
    return () => {
      setScrollAmount(scrollDivRef.current?.scrollTop || 0);
    };
  }, []);

  useEffect(() => {
    const mappedUsers = users?.filter((x) => x.status === "accepted");
    if (mappedUsers) {
      userSearchRef.current = new Fuse(mappedUsers, {
        keys: ["_id", "name"],
        threshold: 0.4,
      });
    }
  }, []);

  // const users = users?.filter(
  //   (x) => x.status === "accepted"
  // );

  return (
    <div className="chat-sidebar">
      <ImgPopup
        show={showProfilePic}
        handleClose={() => setShowProfilePic(false)}
        className="profile-pic-popup"
      >
        <motion.img
          initial={{
            opacity: 1,
            y: imgLocation.y,
            x: imgLocation.x,
            scale: 0.22,
            borderRadius: "50%",
          }}
          animate={{
            scale: 1,
            y: 0,
            x: 0,
            transition: { duration: 0.23, ease: easeIn },
            borderRadius: "4%",
          }}
          exit={{
            opacity: 0,
            scale: 0.1,
            y: imgLocation.y,
            x: imgLocation.x,
            transition: { duration: 0.15, ease: easeIn },
          }}
          src={users?.[imgLocation.i]?.img}
        ></motion.img>
      </ImgPopup>
      {!showSearchBar ? (
        <div className="chat-header">
          <div className="title">
            @{role == 1 ? data?._id : currentTutor?._id}
          </div>
          <div
            className="search-icon"
            onClick={() => {
              setShowSearchPage(true);
            }}
          >
            <FaSearch />
          </div>
        </div>
      ) : (
        <div className="chat-header search-header">
          <div className="input-container">
            <input
              placeholder="Search..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div
              className="back-icon"
              onClick={() => {
                setQuery("");
                setShowSearchPage(false);
              }}
            >
              <FaArrowLeft />
            </div>
          </div>
        </div>
      )}
      {/* </div> */}
      <div
        className={"chat-list " + (isLgScreen ? "lg-screen" : "sm-screen")}
        ref={scrollDivRef}
      >
        {(query == ""
          ? users.filter((x) => x.status === "accepted")
          : userSearchRef.current?.search(query).map((x) => x.item)
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
                {user?.img ? (
                  <img
                    src={user?.img}
                    onClick={(e) => {
                      e.stopPropagation();
                      // setImgLocation({ x: e.clientX, y: e.clientY });
                      console.log(e.clientX, e.clientY);
                      const vh = Math.max(
                        document.documentElement.clientHeight || 0,
                        window.innerHeight || 0
                      );
                      const vw = Math.max(
                        document.documentElement.clientWidth || 0,
                        window.innerWidth || 0
                      );
                      const startX = -1 * (vw / 2 - e.clientX);
                      const startY = -1 * (vh / 2 - e.clientY);
                      setImgLocation({ x: startX, y: startY, i });
                      setTimeout(() => {
                        setShowProfilePic(true);
                      }, 100);
                    }}
                  />
                ) : role == 1 ? (
                  <FaUserTie />
                ) : (
                  <FaUser />
                )}
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
