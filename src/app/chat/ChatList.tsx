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
import Popup from "@components/Popup";
import ImgPopup from "@components/ImgPopup";
import Fuse from "fuse.js";
import { TutorSearchType } from "@src/types/StudentType";
import axios from "axios";

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
  const { newMssgs } = useData();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUserId(location.pathname.split("/")[2]);
  }, [location.pathname]);
  const userSearchRef = useRef<Fuse<TutorSearchType>>();

  useEffect(() => {
    const requestUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const l = [position.coords.latitude, position.coords.longitude];
            console.log("Location: ", l);
            // axios.post(
            //   `${import.meta.env.VITE_SERVER}/user/location-update`,
            //   {
            //     location: l,
            //   },
            //   {
            //     withCredentials: true,
            //   }
            // );
          },
          (error) => {
            console.error("Error obtaining location:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    // if login but user does not have location
    if (data || currentTutor) requestUserLocation();
  }, [data, currentTutor]);

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
  }, [users]);

  // const users = users?.filter(
  //   (x) => x.status === "accepted"
  // );
  return (
    <div className="sidebar chat-sidebar">
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
        <div className="sidebar-header chat-sidebar-header">
          <div className="title">
            @{role == 1 ? data?._id : currentTutor?._id}
          </div>
          <div
            className="search-icon"
            onClick={() => {
              setShowSearchPage(true);
              setTimeout(() => {
                searchInputRef.current?.focus();
              }, 100);
            }}
          >
            <FaSearch />
          </div>
        </div>
      ) : (
        <div className="sidebar-header chat-sidebar-header">
          <div className="input-container">
            <input
              placeholder="Search..."
              type="text"
              value={query}
              ref={searchInputRef}
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
          const newMssgCount = newMssgs[user._id];
          return (
            <motion.div
              // initial={{ opacity: 0, y: 50 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.3, delay: i * 0.1 }}
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
                  <p className="name">{user.name}</p>
                  {user.isOnline && <p className="online">online</p>}
                </div>
                <div className="bottom-row">
                  <p className="username">@{user._id}</p>
                  {newMssgCount > 0 && (
                    <p className="mssg-count">{newMssgs[user._id]}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
