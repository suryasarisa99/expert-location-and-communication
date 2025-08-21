import React, { useEffect, useState } from "react";
import { RiMessage3Fill, RiMessage3Line } from "react-icons/ri";
import { AiFillNotification, AiOutlineNotification } from "react-icons/ai";
import { IoSettingsOutline, IoSettings, IoSearchSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { RiUploadCloudLine, RiUploadCloudFill } from "react-icons/ri";
import useData from "@hooks/useData";
import { TbCarouselVertical, TbCarouselVerticalFilled } from "react-icons/tb";
import { SearchIcon, SearchXIcon } from "lucide-react";
type SideBarProps = {
  isLgScreen: boolean;
};

export default function SideBar({ isLgScreen }: SideBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useData();
  const [navItems, setNavItems] = useState([
    {
      name: "Chats",
      path: "/chat",
      icon: RiMessage3Line,
      activeIcon: RiMessage3Fill,
    },

    {
      name: "Profile",
      path: "/profile",
      icon: IoSettingsOutline,
      activeIcon: IoSettings,
    },
  ]);

  useEffect(() => {
    if (role == 1) {
      const searchRoute = {
        name: "Search",
        path: "/search",
        icon: IoSearchSharp,
        activeIcon: IoSearchSharp,
        // icon: SearchIcon,
        // activeIcon: SearchXIcon,
      };

      const postsRoute = {
        name: "Posts",
        path: "/posts",
        icon: TbCarouselVertical,
        activeIcon: TbCarouselVerticalFilled,
      };
      const updatedNavItems = [...navItems];
      updatedNavItems.splice(1, 0, searchRoute, postsRoute);
      setNavItems(updatedNavItems);
    } else if (role == 0) {
      const uploadRoute = {
        name: "Upload",
        path: "/upload",
        icon: RiUploadCloudLine,
        activeIcon: RiUploadCloudFill,
      };
      const notificationRoute = {
        name: "Notifications",
        path: "/notifications",
        icon: AiOutlineNotification,
        activeIcon: AiFillNotification,
      };
      const updatedNavItems = [...navItems];
      updatedNavItems.splice(1, 0, uploadRoute, notificationRoute);
      setNavItems(updatedNavItems);
    }
  }, [role]);

  return (
    <div className={"navbar " + (isLgScreen ? "lg-screen" : "sm-screen")}>
      {navItems.map((item, index) => (
        <div
          key={index}
          className="nav-item"
          onClick={() => {
            navigate(item.path);
          }}
        >
          {location.pathname.startsWith(item.path) ? (
            <div className="active icon-outer">
              <item.activeIcon />
            </div>
          ) : (
            <div className="icon-outer">
              <item.icon />
            </div>
          )}
          {/* <span>{item.name}</span> */}
        </div>
      ))}
    </div>
  );
}
