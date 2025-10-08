import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TbDotsVertical } from "react-icons/tb";
import { FaUser, FaChevronLeft, FaUserTie } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import useData from "@hooks/useData";
import { storage } from "../../../firebase";
import { AiOutlinePaperClip } from "react-icons/ai";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { BiLogoBootstrap } from "react-icons/bi";
import ImageCrop2 from "../../components/ImageCrop2";
import "./Messages.scss";
import axiosInstance from "@utils/axios";
import { ContextMenu } from "../../components/ContextMenu";
import { CopyIcon } from "lucide-react";
import { socket } from "@context/Data/DataContext";
import Message from "./Message";
import LoadingSpinner from "@components/LoadingSpinner";

export default function ChatSection({ isLgScreen }: { isLgScreen: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imgPickedMode, setImgPickedMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>(-1);
  const { messages, setMessages } = useData();
  const scrollDivRef = useRef<HTMLDivElement>(null);
  const { role, selectedFile, setSelectedFile } = useData();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileDetails, setFileDetails] = useState({
    name: "",
    size: 0,
  });
  const [progress, setProgress] = useState(-1);
  const selectedText = useRef<string | null>(null);
  const [replyText, setReplyText] = useState(false);

  useEffect(() => {
    if (messages.length > 0 && scrollDivRef.current) {
      scrollDivRef.current.scrollTo({
        top: scrollDivRef.current.scrollHeight,
      });
    }
  }, [messages]);

  useEffect(() => {
    return () => setMessages([]);
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log("fetching messages");
    axiosInstance
      .get(`user/mssgs/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setMessages(res.data.messages);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files[0]);
      const file = e.target.files[0];
      setFileDetails({ name: file.name, size: file.size });

      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.onload = (e) => {
        const file = fileReader.result;
        setSelectedFile(file as string);
        setImgPickedMode(true);
      };
    }
  }

  async function handleImageSend() {
    setImgPickedMode(false);
    const imageBlob = await (await fetch(selectedFile as string)).blob();
    const storageRef = ref(storage, `chat/${Date.now()}_${fileDetails.name}`);
    const caption = msg;
    setMessages((prv) => {
      return [
        ...prv,
        {
          isStudent: role == 1,
          mssg: caption,
          time: new Date().toLocaleTimeString(),
          img: selectedFile as string,
          ai: false,
        },
      ];
    });
    setMsg("");
    // less than 400kb
    if (fileDetails.size < 400000)
      timerRef.current = window.setInterval(() => {
        setProgress((prv) => {
          if (prv == 100) {
            clearInterval(timerRef.current);
            return -1;
          }
          if (prv + 10 <= 60) return Math.max(prv + 10, prv);
          else {
            clearInterval(timerRef.current);
            return prv;
          }
        });
      }, 150);
    uploadBytesResumable(storageRef, imageBlob).on(
      "state_changed",
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.max(p - 10, 0));
        console.log("Upload is " + p + "% done");
      },
      (error) => {
        console.log(error);
      },
      async () => {
        window.setTimeout(() => {
          setProgress(100);
          window.setTimeout(() => {
            setProgress(-1);
          }, 150);
        }, 120);
        const downloadURL = await getDownloadURL(storageRef);
        handleSendMessage(caption, downloadURL, true);
      }
    );
  }

  function handleSendMessage(
    newMssg: string,
    imgUrl?: string,
    messgsStateUpdated = false
  ) {
    if (!newMssg && !imgUrl) return;
    console.log(newMssg);
    if (!messgsStateUpdated)
      setMessages((prv) => [
        ...prv,
        {
          isStudent: role == 1,
          mssg: newMssg,
          time: new Date().toLocaleTimeString(),
          ai: false,
        },
      ]);

    // return axios.post(
    //   `${import.meta.env.VITE_SERVER}/user/mssg`,
    //   {
    //     to: id,
    //     mssg: newMssg,
    //     img: imgUrl,
    //   },
    //   {
    //     withCredentials: true,
    //   }
    // );

    socket.emit("new-mssg", {
      to: id,
      mssg: newMssg,
      img: imgUrl,
    });
  }
  function handleReplyMessage(imgUrl?: string, messgsStateUpdated = false) {
    // if (!newMssg && !imgUrl) return;
    console.log(msg);
    if (!messgsStateUpdated)
      setMessages((prv) => [
        ...prv,
        {
          isStudent: role == 1,
          mssg: msg,
          time: new Date().toLocaleTimeString(),
          ai: false,
        },
      ]);
    socket.emit("new-mssg", {
      to: id,
      mssg: msg,
      img: imgUrl,
      extra: selectedText.current,
    });
  }

  async function onMssgSubmit(e: FormEvent) {
    e.preventDefault();
    if (replyText) handleReplyMessage();
    else handleSendMessage(msg);
    setMsg("");
  }

  return (
    <div className="chat-section">
      {/* <ContextMenu global items={[]} getText={(s) => {}}></ContextMenu> */}
      {imgPickedMode && (
        <ImageCrop2
          image={selectedFile as string}
          onCancel={() => {
            setImgPickedMode(false);
          }}
          imgSize={fileDetails.size}
          caption={msg}
          onCaptionChange={(caption) => setMsg(caption)}
          onSend={handleImageSend}
        />
      )}
      <div className="chat-top-bar">
        <div className="left">
          <div className="back-arrow" onClick={() => navigate("/chat")}>
            <FaChevronLeft />
          </div>
          <div
            className="chat-avatar"
            onClick={() => {
              navigate(`/chat/${id}/profile`);
            }}
          >
            {role == 1 ? <FaUserTie /> : <FaUser />}
          </div>
          <p className="chat-name">{id}</p>
        </div>
        <TbDotsVertical />
      </div>
      {loading ? (
        // <div className="loading"> loading...</div>
        <LoadingSpinner fullscreen absolute={isLgScreen} />
      ) : (
        <div className="mssgs" ref={scrollDivRef}>
          {messages.map((mssg, i) => {
            return (
              <Message
                key={i}
                mssg={mssg}
                role={role}
                selectedText={selectedText}
                progress={progress}
                i={i}
                len={messages.length}
              />
            );
          })}
        </div>
      )}
      <form onSubmit={onMssgSubmit} className="chat-bottom">
        <input
          type="file"
          accept="image/*"
          placeholder="Upload"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <div className="inner">
          <div className="input-div">
            <input
              type="text"
              name="mssg"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message"
              autoComplete="chat"
              autoCorrect="on"
              autoCapitalize="false"
            />
          </div>
          <button
            className="round-icon-btn icon-btn share-btn"
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <AiOutlinePaperClip />
          </button>
          <button className="round-icon-btn icon-btn send-btn">
            <IoSend />
          </button>
        </div>
      </form>
    </div>
  );
}
