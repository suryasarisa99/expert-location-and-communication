import useData from "@hooks/useData";
import { TutorType } from "@src/types/StudentType";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { MdShareLocation } from "react-icons/md";
export default function SearchSection() {
  const skillRefs = useRef<HTMLDivElement[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [tutorData, setTutorData] = useState<TutorType | null>(null);
  const { tutors } = useData();
  useEffect(() => {
    console.log("search section mounted");
    function setWidthSkillPieChart() {
      skillRefs.current.forEach((skillDiv) => {
        console.log(skillDiv);
        skillDiv.style.setProperty("--w", skillDiv.clientWidth + "px");
      });
    }

    axios.get(`${import.meta.env.VITE_SERVER}/user/tutor/${id}`).then((res) => {
      console.log(res.data);
      setTutorData(res.data);
      setTimeout(() => {
        setWidthSkillPieChart();
      }, 20);
    });

    window.addEventListener("resize", setWidthSkillPieChart);
    return () => {
      console.log("search section unmounted");
      window.removeEventListener("resize", setWidthSkillPieChart);
    };
  }, [id]);

  if (!tutorData) return null;

  return (
    <div className="search-section chat-section">
      <div className="tutor-bio">
        <div className="tutor-avatar">
          <FaUser />
        </div>
        <div className="tutor-details">
          <p className="tutor-name">{tutorData.name}</p>
          <p className="tutor-username">@{tutorData._id}</p>
          <div className="bottom-row">
            <button
              onClick={() => {
                const status = tutors.find((x) => x._id == id)
                  ?.status as string;
                if (status == "accepted") navigate("/chat/" + id);
                else if (status == "rejected")
                  alert("Tutor has rejected your request");
                else if (status == "pending")
                  alert("Tutor has not accepted your request");
                else alert("send request to tutor");
              }}
            >
              {{
                accepted: "Message",
                pending: "Pending",
                rejected: "Rejected",
                "-": "Follow",
              }[tutors.find((x) => x._id == id)?.status as string] || "Follow"}
            </button>
            <p className="tutor-location">
              <MdShareLocation />
            </p>
          </div>
        </div>
      </div>
      <h3 className="skills-heading">Skills</h3>
      <div className="tutor-skills">
        {tutorData.skills.map((skill, i) => (
          <div
            className="skill"
            key={i}
            ref={(el) => {
              skillRefs.current[i] = el as HTMLDivElement;
            }}
          >
            <div className={"pie " + `l${skill.level}`}>
              {skill.level * 20}%
            </div>
            <p className="skill-name">{skill.name}</p>
          </div>
        ))}
      </div>
      <div className="tutor-more-details">
        <div className="tutor-work-exp details-list">
          <h3>Work Experience</h3>
          {tutorData.workExperiences.map((exp, i) => (
            <div className="work-exp" key={i}>
              <p className="position">{exp.position}</p>
              <div className="row">
                <p className="company">{exp.company}</p>
                <p className="year">
                  {exp.from}-{exp.to}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="tutor-education details-list">
          <h3>Education</h3>
          {tutorData.educations.map((edu, i) => (
            <div className="education" key={i}>
              <p className="degree">{edu.degree}</p>
              <div className="row">
                <p className="institution">{edu.institute}</p>
                <p className="year">
                  {edu.from}-{edu.to}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
