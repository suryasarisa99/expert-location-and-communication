import useData from "@hooks/useData";
import axios from "axios";
import React, { useEffect } from "react";

export default function Notifications() {
  const { role, currentTutor, setCurrentTutor } = useData();

  useEffect(() => {
    console.log(currentTutor?.requests);
  }, [currentTutor]);

  if (
    !currentTutor ||
    currentTutor.requests.filter((x) => x.status == "pending").length == 0
  )
    return (
      <div className="notifications-page page">
        <center>
          <p>No Notifications</p>
        </center>
      </div>
    );

  function handleRequest(
    id: string,
    name: string,
    status: "accepted" | "rejected"
  ) {
    setCurrentTutor((prev) => {
      if (!prev) return prev;
      prev.requests = prev.requests.filter((x) => x._id !== id);
      return { ...prev };
    });
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/user/accept/${id}/${status}`,
        {
          studentName: name,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  }
  return (
    <div className="notifications-page page">
      <div className="notifications-outer">
        <div className="notifications">
          {currentTutor.requests
            .filter((x) => x.status == "pending")
            .map((request, i) => (
              <div key={request._id} className="notification">
                <div className="column">
                  <p className="name">{request.name}</p>
                  <p className="username">@{request._id}</p>
                </div>
                <div className="actions">
                  <button
                    className="reject-btn"
                    onClick={() =>
                      handleRequest(request._id, request.name, "rejected")
                    }
                  >
                    Reject
                  </button>
                  <button
                    className="accept-btn"
                    onClick={() =>
                      handleRequest(request._id, request.name, "accepted")
                    }
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
