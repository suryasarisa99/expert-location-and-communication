import React, { useState, useEffect, createContext, useReducer } from "react";
import DataContextType from "./DataContextTypes";
import DataContextTypes from "./DataContextTypes";
import {
  StudentType,
  TutorType,
  TutorSearchType,
} from "@src/types/StudentType";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const DataContext = createContext({} as DataContextType);
export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<StudentType | null>(null);
  const [currentTutor, setCurrentTutor] = useState<TutorType | null>(null);
  const [tutors, setTutors] = useState<TutorSearchType[]>([]);
  const [tutorData, setTutorData] = useState<TutorSearchType[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | undefined>();

  const navigate = useNavigate();
  const [role, setRole] = useState(-1);

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      let location = window.location.pathname;
      if (["/", "/signin"].includes(location)) location = "/chat";
      console.log("prv loc: ", location);
      axios
        .get(`${import.meta.env.VITE_SERVER}/auth/me`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.loggedIn) {
            setRole(res.data.role);
            if (res.data.role == 1) {
              setData(res.data.student);
              setTutors(res.data.tutors);
              navigate(location);
            } else if (res.data.role == 0) {
              setCurrentTutor(res.data.tutor);
              navigate(location);
            }
          } else {
            // localStorage.removeItem("loggedIn");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("removed loggedin in localstorage");
          // localStorage.removeItem("loggedIn");
        });
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        tutors,
        setTutors,
        currentTutor,
        setCurrentTutor,
        role,
        setRole,
        selectedFile,
        setSelectedFile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
