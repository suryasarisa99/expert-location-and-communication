import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TbDotsVertical } from "react-icons/tb";
import { FaUser, FaChevronLeft } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
// type ChatSectionProps = {
//   id: number;
// };

export default function ChatSection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const mssgs = [
    { isStudent: true, mssg: "Hello", time: "12:00" },
    { isStudent: false, mssg: "Hi", time: "12:01" },
    { isStudent: true, mssg: "How are you", time: "12:02" },
    { isStudent: false, mssg: "I am good", time: "12:03" },
    { isStudent: true, mssg: "What are you doing", time: "12:04" },
    { isStudent: false, mssg: "Nothing much", time: "12:05" },
    { isStudent: true, mssg: "Ok", time: "12:06" },
    { isStudent: false, mssg: "Bye", time: "12:07" },
    { isStudent: true, mssg: "Bye", time: "12:08" },
    { isStudent: false, mssg: "Bye", time: "12:09" },
    { isStudent: true, mssg: "Hello", time: "12:00" },
    { isStudent: false, mssg: "Hi", time: "12:01" },
  ];
  return (
    <div className="chat-section">
      <div className="chat-top-bar">
        <div className="left">
          <div className="back-arrow" onClick={() => navigate("/chat")}>
            <FaChevronLeft />
          </div>
          <div className="chat-avatar">
            <FaUser />
          </div>
          <p className="chat-name">User {id}</p>
        </div>
        <TbDotsVertical />
      </div>
      <div className="mssgs">
        {mssgs.map((mssg, i) => (
          <div
            key={i}
            className={
              "mssg " + (mssg.isStudent ? "student-mssg" : "tutor-mssg")
            }
          >
            <p className="mssg-text">{mssg.mssg}</p>
            {/* <p className="mssg-time">{mssg.time}</p> */}
          </div>
        ))}
      </div>
      <div className="chat-bottom">
        <div className="inner">
          <div className="input-div">
            <input type="text" placeholder="Type a message" />
          </div>
          <div className="send-btn">
            <AiOutlineSend size={28} />
          </div>
        </div>
      </div>
    </div>
  );
}
