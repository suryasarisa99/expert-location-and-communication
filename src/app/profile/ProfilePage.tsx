import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import { FaUser, FaUserTie } from "react-icons/fa";
import useData from "@hooks/useData";
import CropProfilePic from "@app/crop/CropProfilePic";
import useUpload from "@hooks/useUpload";
import axios from "axios";
import { BiBriefcase, BiSolidBriefcase } from "react-icons/bi";
import {
  FaUserGraduate,
  FaGraduationCap,
  FaStar,
  FaRegStar,
} from "react-icons/fa6";
import { socket } from "@context/Data/DataContext";

export default function ProfilePage({ isLgScreen }: { isLgScreen: boolean }) {
  const navigate = useNavigate();
  const { role, data, currentTutor, setData, setCurrentTutor } = useData();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { progress, setUpload } = useUpload();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectDetails, setSelectedDetails] = useState(0);

  function uploadCroppedImage(croppedImg: string) {
    if (role == 1)
      setData((prv) => {
        if (!prv) return null;
        return { ...prv, img: croppedImg };
      });
    else if (role == 0) {
      setCurrentTutor((prv) => {
        if (!prv) return null;
        return { ...prv, img: croppedImg };
      });
    }

    setUpload({
      file: croppedImg,
      fileName: "profile-pic",
      directory: "pics",
      size: 0,
      cleanUpAction: () => {},
      onFirebaseUploaded: (url) => {
        axios
          .post(
            `${import.meta.env.VITE_SERVER}/user/profile/upload`,
            {
              url,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => {});
      },
    });
  }

  function onImgChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(e.target?.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  }
  const icons = [
    {
      icon: <FaRegStar />,
      activeIcon: <FaStar />,
      label: "Skills",
    },
    {
      icon: <BiBriefcase />,
      activeIcon: <BiSolidBriefcase />,
      label: "Previous Works",
    },
    {
      icon: <FaGraduationCap />,
      activeIcon: <FaUserGraduate />,
      label: "Education",
    },
  ];
  return (
    <div className="profile-page">
      {isCropping && (
        <CropProfilePic
          image={selectedFile as string}
          onCancel={() => {
            setIsCropping(false);
          }}
          onSend={uploadCroppedImage}
        />
      )}
      <div className="profile-top">
        <div
          className="profile-pic"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          {role == 0 ? (
            currentTutor?.img ? (
              <img src={currentTutor?.img} />
            ) : (
              <FaUserTie />
            )
          ) : data?.img ? (
            <img src={data?.img} />
          ) : (
            <FaUser />
            // <div className="icon-outer">
            // </div>
          )}
        </div>
        <div className="profile-info">
          <p className="name">{currentTutor?.name || data?.name}</p>
          <p className="usename">@{currentTutor?._id || data?._id}</p>
          <div className="email">{currentTutor?.email || data?.email}</div>
          <div className="role">{role == 0 ? "Tutor" : "Student"}</div>
        </div>
      </div>
      {progress !== -1 && <progress value={progress} max="100" />}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onImgChange}
        style={{
          display: "none",
        }}
      />

      {!isLgScreen && role == 0 && (
        <div className="details-selection-header">
          {icons.map((icon, i) => (
            <div
              key={i}
              className={`icon ${selectDetails == i ? "active" : ""}`}
              onClick={() => setSelectedDetails(i)}
            >
              {selectDetails == i ? icon.activeIcon : icon.icon}
              <p>{icon.label}</p>
            </div>
          ))}
        </div>
      )}

      {currentTutor && (
        <div className="tutor-details">
          {(isLgScreen || selectDetails == 0) && (
            <div className="details">
              <h3>Skills</h3>
              {currentTutor.skills.map((skill, i) => (
                <div key={i}>
                  <p className="skill-name">{skill.name}</p>
                  <p className="level">{skill.level}</p>
                </div>
              ))}
            </div>
          )}
          {(isLgScreen || selectDetails == 1) && (
            <div className="details">
              <h3>Previous Works</h3>
              {currentTutor.workExperiences.map((skill, i) => (
                <div key={i}>
                  <p className="position">{skill.position}</p>
                  <div className="row">
                    <p className="company">{skill.company}</p>
                    <div className="years">
                      <div className="from">{skill.from}</div>
                      <span>-</span>

                      <div className="to">{skill.to}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {(isLgScreen || selectDetails == 2) && (
            <div className="details">
              <h3>Education</h3>
              {currentTutor.educations.map((edu, i) => (
                <div key={i}>
                  <p className="degree">{edu.degree}</p>
                  <div className="row">
                    <p className="institute">{edu.institute}</p>
                    <div className="years">
                      <p className="from">{edu.from}</p>
                      <span>-</span>
                      <p className="to">{edu.to}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => {
          window.open(
            "`https://www.google.com/maps?q=17.48163339452945,78.46516503349199`",
            "_blank"
          );
        }}
      >
        Location
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          socket.disconnect();
          navigate("/signin");
        }}
      >
        Logout
      </button>
    </div>
  );
}
