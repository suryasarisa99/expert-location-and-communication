import React, { useState } from "react";
import BasicSignup from "./BasicSignup";
import { FaPlusCircle } from "react-icons/fa";

type SkillProps = {
  skills: SkillType[];
  setSkills: (skil: SkillType) => void;
};

type SkillType = {
  name: string;
  level: number;
};

export default function TeacherSignupSkills({ skills, setSkills }: SkillProps) {
  // const [skills, setSkills] = useState<SkillType[]>([]);

  function handleSubmit(e: React.FormEvent) {
    // if (e) {
    e.preventDefault();
    // }
    console.log("submit");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const skill = formData.get("skill") as string;
    const level = parseInt((formData.get("skill-level") as string) || "0");
    if (skill == "" || level == 0) return;
    setSkills({ name: skill, level });
    form.reset();
  }

  return (
    <div className="signup-skills signup-add-items">
      <div className="items-container">
        {skills.map((skill, i) => (
          <div className="item skill-item" key={i}>
            <p className="skill-name">{skill.name}</p>
            <p className="skill-level">{skill.level * 20} %</p>
          </div>
        ))}
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" name="skill" placeholder="Enter your skill" />
        <div className="row">
          {/* <input type="range" name="skill-level" /> */}
          <input
            placeholder="Years of experience"
            type="number"
            name="skill-level"
          />
          <button className="icon-btn add-btn" onClick={() => {}}>
            <FaPlusCircle size={30} />
          </button>
        </div>
      </form>
    </div>
  );
}
