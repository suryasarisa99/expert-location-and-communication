import React from "react";
import { motion } from "framer-motion";

type BasicSignupProps = {
  commonData: {
    name: string;
    age: string;
    role: string;
  };
  setCommonData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      age: string;
      role: string;
    }>
  >;
};

export default function BasicSignup({
  commonData,
  setCommonData,
}: BasicSignupProps) {
  return (
    <div className="signup-basic auth">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={commonData.name}
        onChange={(e) => setCommonData({ ...commonData, name: e.target.value })}
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={commonData.age}
        onChange={(e) => setCommonData({ ...commonData, age: e.target.value })}
      />
      <div>
        <p className="role-title">What is your Role ?</p>
        <label className="option" htmlFor="role-student">
          <p>Student</p>
          <input
            type="radio"
            id="role-student"
            name="role"
            value="1"
            checked={commonData.role === "1"}
            onChange={(e) =>
              setCommonData({ ...commonData, role: e.target.value })
            }
          />
        </label>
        <label className="option" htmlFor="role-tutor">
          <p>Tutor</p>
          <input
            type="radio"
            name="role"
            id="role-tutor"
            value="0"
            checked={commonData.role === "0"}
            onChange={(e) =>
              setCommonData({ ...commonData, role: e.target.value })
            }
          />
        </label>
      </div>
    </div>
  );
}
