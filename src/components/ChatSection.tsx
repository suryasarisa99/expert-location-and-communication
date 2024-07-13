import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TbDotsVertical } from "react-icons/tb";
import { FaUser, FaChevronLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import useData from "@hooks/useData";
import { storage } from "../../firebase";
import { AiOutlinePaperClip } from "react-icons/ai";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { BiLogoBootstrap } from "react-icons/bi";
import ImageCrop2 from "./ImageCrop2";

export default function ChatSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imgPickedMode, setImgPickedMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>(-1);
  type MssgType = {
    isStudent: boolean;
    mssg: string;
    time: string;
    img?: string;
  };

  const scrollDivRef = useRef<HTMLDivElement>(null);
  const { role, selectedFile, setSelectedFile } = useData();
  const [mssg, setMssg] = useState("");
  const [messages, setMessages] = useState<MssgType[]>([]);
  const [fileDetails, setFileDetails] = useState({
    name: "",
    size: 0,
  });
  const [progress, setProgress] = useState(-1);

  useEffect(() => {
    if (scrollDivRef.current) {
      scrollDivRef.current.scrollTo({ top: scrollDivRef.current.scrollHeight });
    }
  }, [messages]);

  useEffect(() => {
    console.log("fetching messages");
    axios
      .get(`${import.meta.env.VITE_SERVER}/user/mssgs/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setMessages(res.data.messages);
      });
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
        // console.log(file);
        // console.log(e.target?.result);
        setSelectedFile(file as string);
        setImgPickedMode(true);
      };
    }
  }

  async function handleImageSend() {
    setImgPickedMode(false);
    const imageBlob = await (await fetch(selectedFile as string)).blob();
    const storageRef = ref(storage, `chat/${Date.now()}_${fileDetails.name}`);
    const caption = mssg;
    setMessages((prv) => {
      return [
        ...prv,
        {
          isStudent: role == 1,
          mssg: caption,
          time: new Date().toLocaleTimeString(),
          img: selectedFile as string,
        },
      ];
    });
    setMssg("");
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
        handleSendMessage(caption, downloadURL, true).then((res) => {});
      }
    );
  }

  function handleSendMessage(
    newMssg: string,
    imgUrl?: string,
    messgsStateUpdated = false
  ) {
    console.log(newMssg);
    if (!messgsStateUpdated)
      setMessages((prv) => [
        ...prv,
        {
          isStudent: role == 1,
          mssg: newMssg,
          time: new Date().toLocaleTimeString(),
        },
      ]);

    return axios.post(
      `${import.meta.env.VITE_SERVER}/user/mssg`,
      {
        to: id,
        mssg: newMssg,
        img: imgUrl,
      },
      {
        withCredentials: true,
      }
    );
  }

  async function onMssgSubmit(e: FormEvent) {
    e.preventDefault();
    handleSendMessage(mssg);
    setMssg("");
  }

  return (
    <div className="chat-section">
      {imgPickedMode && (
        <ImageCrop2
          image={selectedFile as string}
          onCancel={() => {
            setImgPickedMode(false);
          }}
          imgSize={fileDetails.size}
          caption={mssg}
          onCaptionChange={(caption) => setMssg(caption)}
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
            <FaUser />
          </div>
          <p className="chat-name">{id}</p>
        </div>
        <TbDotsVertical />
      </div>
      <div className="mssgs" ref={scrollDivRef}>
        {messages.map((mssg, i) => (
          <div
            key={i}
            className={
              "mssg " +
              (mssg.img ? "img-mssg " : "") +
              (mssg.isStudent
                ? role == 1
                  ? "right-mssg"
                  : "left-mssg"
                : role == 1
                ? "left-mssg"
                : "right-mssg")
            }
          >
            {mssg.img && <img className="img" src={mssg.img} />}
            <p className="mssg-text">{mssg.mssg}</p>
            {i === messages.length - 1 && progress !== -1 && (
              <div className="loader">
                <progress value={progress} max={100} />
              </div>
            )}
            {/* <p className="mssg-time">{mssg.time}</p> */}
          </div>
        ))}
      </div>
      <form onSubmit={onMssgSubmit} className="chat-bottom">
        <input
          type="file"
          placeholder="Upload"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <div className="inner">
          <div className="input-div">
            <input
              type="text"
              name="mssg"
              value={mssg}
              onChange={(e) => setMssg(e.target.value)}
              placeholder="Type a message"
              autoComplete="chat"
              autoCorrect="on"
              autoCapitalize="false"
            />
            {/* <textarea
              name="mssg"
              id="mssg"
              placeholder="Type a message"
            ></textarea> */}
          </div>
          <button
            className="icon-btn send-btn"
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <AiOutlinePaperClip />
          </button>
          <button className="icon-btn send-btn">
            <IoSend />
          </button>
        </div>
      </form>
    </div>
  );
}
