import React, { useState, useEffect, createContext, useReducer } from "react";

import DataContextTypes from "./DataContextTypes";
import {
  StudentType,
  TutorType,
  TutorSearchType,
  MssgType,
} from "@src/types/StudentType";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axios";
import Io from "socket.io-client";

export const socket = Io(import.meta.env.VITE_SERVER, {
  path: "/socket.io/",
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  auth: {
    token: localStorage.getItem("token"),
  },
});

export const DataContext = createContext({} as DataContextTypes);
export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<StudentType | null>(null);
  const [currentTutor, setCurrentTutor] = useState<TutorType | null>(null);
  const [users, setUsers] = useState<TutorSearchType[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [newMssgs, setNewMssgs] = useState<{ [key: string]: number }>({});
  const [messages, setMessages] = useState<MssgType[]>([]);

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

  useEffect(() => {
    const currentUser = location.pathname.split("/")[2];
    if (location.pathname) {
      setNewMssgs((prv) => ({ ...prv, [currentUser]: 0 }));
    }
    socket.on("new-mssg", (mssg) => {
      if (mssg.from == currentUser) {
        setMessages((prv) => [...prv, mssg]);
      } else {
        setNewMssgs((prv) => ({
          ...prv,
          [mssg.from]: (prv[mssg.from] || 0) + 1,
        }));
      }
    });
    return () => {
      socket.off("new-mssg");
    };
  }, [location.pathname]);

  useEffect(() => {
    if (role == -1) return;

    console.log("listening for online users");

    socket.on("online-status", (data) => {
      console.log("from socketio: ", data);
      if (role != data.role)
        setUsers((prv) => {
          return prv.map((x) => {
            if (x._id == data.id) return { ...x, isOnline: data.status };
            return x;
          });
        });
    });

    return () => {
      socket.off("online-status");
      socket.off("online-users");
    };
  }, [role]);

  useEffect(() => {
    socket.on("new-std", (data: TutorSearchType) => {
      console.log("from socketio: ", data);
    });
    if (localStorage.getItem("loggedIn")) {
      let location = window.location.pathname;
      if (["/", "/signin"].includes(location)) location = "/chat";
      console.log("prv loc: ", location);
      axiosInstance
        .get("auth/me", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.loggedIn) {
            setRole(res.data.role);
            if (res.data.role == 1) {
              setData(res.data.student);
              const tutorsWithDistance: TutorSearchType[] = [];
              const tutors: TutorSearchType[] = [];
              for (const tutor of res.data.tutors) {
                if (tutor.distance != undefined) tutorsWithDistance.push(tutor);
                else tutors.push(tutor);
              }
              setUsers([
                ...tutorsWithDistance.sort(
                  (a: TutorSearchType, b: TutorSearchType) => {
                    return a.distance! - b.distance!;
                  },
                ),
                ...tutors,
              ]);

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
        newMssgs,
        setNewMssgs,
        messages,
        setMessages,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
