import React, { useState } from "react";
import BasicSignup from "./BasicSignup";
import { FaPlusCircle } from "react-icons/fa";
import { EducationType } from "./Signup";

type EducationProps = {
  educations: EducationType[];
  setEducation: (edu: EducationType) => void;
};

export default function TeacherSignupEdu({
  educations,
  setEducation,
}: EducationProps) {
  type EducationType = {
    degree: string;
    institution: string;
    from: number;
    to: number;
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("submit");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const degree = formData.get("degree") as string;
    const institution = formData.get("institution") as string;
    const startYear = parseInt((formData.get("start-year") as string) || "0");
    const endYear = parseInt((formData.get("end-year") as string) || "0");
    if (degree == "") return;
    setEducation({ degree, institution, from: startYear, to: endYear });
    form.reset();
  }

  return (
    <div className="signup-education signup-add-items">
      <div className="items-container">
        {educations.map((skill, i) => (
          <div className="item education-item" key={i}>
            <p className="degree">{skill.degree}</p>
            <div className="top-row">
              <p className="institution">{skill.institution}</p>
              <div className="year">
                [{skill.from}-{skill.to}]
              </div>
            </div>
          </div>
        ))}
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" name="degree" placeholder="Degree name" />
        <input type="text" name="institution" placeholder="Institution name" />
        <div className="date-row">
          <input type="number" name="start-year" placeholder="Start year" />
          <input type="number" name="end-year" placeholder="End year" />
          <button className="icon-btn add-btn" onClick={() => {}}>
            <FaPlusCircle size={30} />
          </button>
        </div>
      </form>
    </div>
  );
}
