import React, { CSSProperties, useEffect, useState } from "react";
import "./search.scss";
import { FaSearch, FaUser } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import SearchSection from "./SearchSection";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useScroll } from "framer-motion";
import useData from "@hooks/useData";
import axios from "axios";
import { TutorSearchType } from "@src/types/StudentType";

type SearchPageProps = {
  isLgScreen: boolean;
};

export default function SearchPage({ isLgScreen }: SearchPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedId = location.pathname.split("/")[2];
  const [query, setQuery] = useState("");
  const { tutors, setTutors } = useData();

  function handleFollow(tutor: TutorSearchType) {
    if (tutor.status == "accepted") navigate("/chat/" + tutor._id);
    else if (tutor.status == "rejected")
      alert("Tutor has rejected your request");
    else if (tutor.status == "pending")
      alert("Tutor has not accepted your request");
    else {
      setTutors((prv) =>
        prv.map((t) => {
          if (t._id === tutor._id) return { ...t, status: "pending" };
          return t;
        })
      );
      axios.get(`${import.meta.env.VITE_SERVER}/user/follow/${tutor._id}`, {
        withCredentials: true,
      });
    }
  }

  return (
    <div className="search-page page">
      {(isLgScreen || (!isLgScreen && location.pathname === "/search")) && (
        <div className="search-sidebar">
          <div className="search-bar">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search"
              className="search-input"
            />
            <div className="search-icon search-bar-icon">
              <FaSearch />
            </div>
          </div>
          <div className="search-list ">
            {/* {Array.from({ length: 50 }).map((_, i) => ( */}
            {tutors.map((tutor, i) => (
              <div
                className={
                  "search-item " + (selectedId === tutor._id ? "active" : "")
                }
                onClick={() => {
                  if (
                    location.pathname === "/search" ||
                    location.pathname == "/search/"
                  )
                    navigate("/search/" + tutor._id);
                  else navigate("/search/" + tutor._id, { replace: true });
                }}
                key={i}
              >
                <div className="left">
                  <div className="icon-avatar">
                    <FaUser />
                  </div>
                  <div className="content">
                    <p className="title">{tutor.name}</p>
                    <p className="username">@{tutor._id}</p>
                  </div>
                </div>
                <button
                  className={tutor.status || "follow"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(tutor);
                  }}
                >
                  {{
                    accepted: "Message",
                    pending: "Pending",
                    rejected: "Rejected",
                    "-": "Follow",
                  }[tutor.status] ?? "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Routes>
        <Route
          path="/:id"
          key={location.pathname}
          element={<SearchSection />}
        />
      </Routes>
    </div>
  );
}
