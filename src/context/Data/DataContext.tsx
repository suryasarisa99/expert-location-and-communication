import React, { useState, useEffect, createContext, useReducer } from "react";
import Io from "socket.io-client";
import DataContextType from "./DataContextTypes";
import DataContextTypes from "./DataContextTypes";
import {
  StudentType,
  TutorType,
  TutorSearchType,
} from "@src/types/StudentType";
import axios from "axios";
import { useNavigate } from "react-router-dom";

console.log(import.meta.env.VITE_SERVER);
export const socket = Io(import.meta.env.VITE_SERVER, {
  path: "/socket.io/",
  withCredentials: true,
});
export const DataContext = createContext({} as DataContextType);
export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<StudentType | null>(null);
  const [currentTutor, setCurrentTutor] = useState<TutorType | null>(null);
  const [users, setUsers] = useState<TutorSearchType[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | undefined>();

  const navigate = useNavigate();
  const [role, setRole] = useState(-1);

  useEffect(() => {
    socket.on("follow-req", (data) => {
      console.log("folow-req recived : ", data);
      setUsers((prv) => {
        return [...prv, data];
      });
    });
    socket.on("accept-req", (data) => {
      console.log(" accept req from socketio: ", data);
      setUsers((prv) => {
        return prv.map((x) => {
          if (x._id == data._id) return { ...x, status: data.status };
          return x;
        });
      });
    });
  }, []);

  // useEffect(() => {
  //   if (role == -1) return;

  //   socket.on("accept-req", (data) => {
  //     console.log("accept req: ", data);
  //     if (role == 0) {
  //       setCurrentTutor((prv) => {
  //         if (!prv) return prv;
  //         else
  //           return {
  //             ...prv,
  //             requests: prv.requests.map((x) => {
  //               if (x._id == data._id) return { ...x, status: data.status };
  //               return x;
  //             }),
  //           };
  //       });
  //     } else if (role == 1) {
  //       setTutors((prv) => {
  //         return prv.map((x) => {
  //           if (x._id == data._id) return { ...x, status: data.status };
  //           return x;
  //         });
  //       });
  //     }
  //   });
  //   return () => {
  //     socket.off("accept-req");
  //   };
  // }, [role]);

  useEffect(() => {
    socket.on("new-std", (data: TutorSearchType) => {
      console.log("from socketio: ", data);
    });
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
              setUsers(res.data.tutors);
              navigate(location);
            } else if (res.data.role == 0) {
              setCurrentTutor(res.data.tutor);
              setUsers(res.data.students);
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
        users,
        setUsers,
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
