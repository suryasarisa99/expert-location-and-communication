import React, { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function SearchSection() {
  const skillRefs = useRef<HTMLDivElement[]>([]);
  //   const skillRefs = Array.from({ length: 4 }).map(() =>
  //     React.createRef<HTMLDivElement>()
  //   );
  const { id } = useParams();

  useEffect(() => {
    console.log("search section mounted");
    function setWidthSkillPieChart() {
      skillRefs.current.forEach((skillDiv) => {
        console.log(skillDiv);
        skillDiv.style.setProperty("--w", skillDiv.clientWidth + "px");
      });
    }

    setWidthSkillPieChart();
    window.addEventListener("resize", setWidthSkillPieChart);
    return () => {
      console.log("search section unmounted");
      window.removeEventListener("resize", setWidthSkillPieChart);
    };
  }, []);

  const teacherData = {
    name: "Jaya Surya",
    bio: "Something",
    username: "jaya_surya",
    location: "location",
    skills: [
      {
        name: "Python",
        level: 4,
      },
      {
        name: "Java",
        level: 3,
      },
      {
        name: "C++",
        level: 5,
      },
      {
        name: "JavaScript",
        level: 4,
      },
    ],
    education: [
      {
        degree: "B.Tech",
        institution: "IIT",
        year: "2019",
      },
      {
        degree: "M.Tech",
        institution: "IIT",
        year: "2021",
      },
      {
        degree: "Ph.D",
        institution: "IIT",
        year: "2023",
      },
    ],
    workExperience: [
      {
        position: "Software Developer",
        company: "Google",
        year: "2019-2021",
      },
      {
        position: "Software Developer",
        company: "Microsoft",
        year: "2021-2023",
      },
      {
        position: "Tutorial Assistant",
        company: "IIT",
        year: "2023-2025",
      },
    ],
  };

  return (
    <div className="search-section chat-section">
      <div className="tutor-bio">
        <div className="tutor-avatar">
          <FaUser />
        </div>
        <div className="tutor-details">
          <p className="tutor-name">{teacherData.name}</p>
          <p className="tutor-username">
            @{teacherData.username}- {id}
          </p>
          <p className="tutor-location"></p>
        </div>
      </div>
      <div className="tutor-skills">
        {teacherData.skills.map((skill, i) => (
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
          {teacherData.workExperience.map((exp, i) => (
            <div className="work-exp" key={i}>
              <p className="position">{exp.position}</p>
              <div className="row">
                <p className="company">{exp.company}</p>
                <p className="year">{exp.year}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="tutor-education details-list">
          <h3>Education</h3>
          {teacherData.education.map((edu, i) => (
            <div className="education" key={i}>
              <p className="degree">{edu.degree}</p>
              <div className="row">
                <p className="institution">{edu.institution}</p>
                <p className="year">{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
