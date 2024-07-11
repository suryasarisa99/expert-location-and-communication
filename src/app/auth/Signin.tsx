import PasswordInput from "@components/PasswordInput";
import React, { FormEvent, useState } from "react";

export default function Signin() {
  const [pass, setPass] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    role: 1,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(formData);
  }
  return (
    <div className="signin auth" onSubmit={handleSubmit}>
      <h1>Signin</h1>
      <form action="">
        <input type="text" name="username" placeholder="Username" />
        <PasswordInput value={pass} onChange={setPass} />

        <div>
          <p className="role-title">What is your Role ?</p>
          <label className="option" htmlFor="role-student">
            <p>Student</p>
            <input
              type="radio"
              id="role-student"
              name="role"
              value="1"
              checked={formData.role == 1}
              onChange={(e) =>
                setFormData({ ...formData, role: parseInt(e.target.value) })
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
              checked={formData.role == 0}
              onChange={(e) =>
                setFormData({ ...formData, role: parseInt(e.target.value) })
              }
            />
          </label>
        </div>
        <div className="btn-row">
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
}
