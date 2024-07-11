import React, { CSSProperties, useEffect, useState } from "react";
import "./search.scss";
import { FaSearch, FaUser } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import SearchSection from "./SearchSection";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useScroll } from "framer-motion";

type SearchPageProps = {
  isLgScreen: boolean;
};

export default function SearchPage({ isLgScreen }: SearchPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedId = location.pathname.split("/")[2];
  const [query, setQuery] = useState("");

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
            {/* <div
              className="close-icon search-bar-icon"
              onClick={() => {
                console.log("hi");
                setQuery("");
              }}
            >
              <IoIosClose />
            </div> */}
          </div>
          <div className="search-list ">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                className={
                  "search-item " + (selectedId === i.toString() ? "active" : "")
                }
                onClick={() => {
                  if (
                    location.pathname === "/search" ||
                    location.pathname == "/search/"
                  )
                    navigate("/search/" + i);
                  else navigate("/search/" + i, { replace: true });
                }}
                key={i}
              >
                <div className="icon-avatar">
                  <FaUser />
                </div>
                <div className="content">
                  <p className="title">Search {i}</p>
                  <p className="desc">description</p>
                </div>
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
