import React, { useState } from "react";
import BasicSignup from "./BasicSignup";
import { FaPlusCircle } from "react-icons/fa";
import { WorkExpType } from "./Signup";

type WorkExpProps = {
  works: WorkExpType[];
  setWorks: (edu: WorkExpType) => void;
};

export default function TeacherSignupWorkExp({
  works,
  setWorks,
}: WorkExpProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("submit");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const position = formData.get("position") as string;
    const company = formData.get("company") as string;
    const startYear = parseInt((formData.get("start-year") as string) || "0");
    const endYear = parseInt((formData.get("end-year") as string) || "0");
    if (position == "") return;
    setWorks({ position, company, from: startYear, to: endYear });
    form.reset();
  }

  return (
    <div className="signup-education signup-add-items">
      <div className="items-container">
        {works.map((skill, i) => (
          <div className="item education-item" key={i}>
            <p className="degree">{skill.position}</p>
            <div className="top-row">
              <p className="institution">{skill.company}</p>
              <div className="year">
                [{skill.from}-{skill.to}]
              </div>
            </div>
          </div>
        ))}
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" name="position" placeholder="Position" />
        <input type="text" name="company" placeholder="Company Name" />
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
