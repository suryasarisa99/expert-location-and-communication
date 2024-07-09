import React from "react";
import { RiMessage3Fill, RiMessage3Line } from "react-icons/ri";
import { AiFillNotification, AiOutlineNotification } from "react-icons/ai";
import { IoSettingsOutline, IoSettings, IoSearchSharp } from "react-icons/io5";
import { useLocation } from "react-router-dom";

type SideBarProps = {
  isLgScreen: boolean;
};

export default function SideBar({ isLgScreen }: SideBarProps) {
  const location = useLocation();

  const navItems = [
    {
      name: "Chats",
      path: "/chat",
      icon: RiMessage3Line,
      activeIcon: RiMessage3Fill,
    },
    {
      name: "Search",
      path: "/search",
      icon: IoSearchSharp,
      activeIcon: IoSearchSharp,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: AiOutlineNotification,
      activeIcon: AiFillNotification,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: IoSettingsOutline,
      activeIcon: IoSettings,
    },
  ];

  return (
    <div className={"side-bar " + (isLgScreen ? "lg-screen" : "sm-screen")}>
      {navItems.map((item, index) => (
        <div key={index} className="nav-item">
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
