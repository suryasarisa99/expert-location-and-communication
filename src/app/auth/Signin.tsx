import PasswordInput from "@components/PasswordInput";
import Popup from "@components/Popup";
import { socket } from "@context/Data/DataContext";
import useData from "@hooks/useData";
import axios from "axios";
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
  const [pass, setPass] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    role: 1,
  });
  const navigate = useNavigate();
  const { setTutors, setData, setRole, setCurrentTutor } = useData();
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState({
    title: "",
    mssg: "",
  });
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { username, role } = formData;
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/auth/signin`,
        {
          username,
          role,
          password: pass,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.loggedIn) {
          setRole(res.data.role);
          if (res.data.role == 1) {
            setData(res.data.student);
            setTutors(res.data.tutors);
          } else {
            setCurrentTutor(res.data.tutor);
          }
          localStorage.setItem("loggedIn", "true");
          navigate("/chat");
        }
      })
      .catch((err) => {
        console.log(err);
        setShowPopup(true);
        if (err.response.data.title) {
          setError({
            title: err.response.data.title,
            mssg: err.response.data.mssg,
          });
        } else {
          setError({
            title: "Error",
            mssg: "Something went wrong",
          });
        }
      });
  }
  return (
    <div className="signin auth" onSubmit={handleSubmit}>
      <h1>SignIn</h1>
      <Popup
        show={showPopup}
        closeOnClickOutside={true}
        closeOnEscape={true}
        handleClose={() => setShowPopup(false)}
        className="basic-popup"
      >
        <div>
          <div className="title">{error.title}</div>
          <div className="mssg">{error.mssg}</div>
          <div className="actions">
            <button
              className="primary"
              onClick={() => {
                setShowPopup(false);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </Popup>
      <form action="">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
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
        <Link to="/" className="auth-link">
          Create Account? SignUp
        </Link>
      </form>
    </div>
  );
}
