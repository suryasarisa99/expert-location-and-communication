import React, { useState, useEffect, useReducer, useRef } from "react";
import BasicSignup from "./BasicSignup";
import TeacherSignupSkills from "./TeacherSignupSkills";
import TeacherSignupWorkExp from "./TeacherSignupWorkExp";
import TeacherSignupEdu from "./TeacherSignupEdu";
import { motion, AnimatePresence } from "framer-motion";
import "./signup.scss";
import { Link, useNavigate } from "react-router-dom";
import SignupLast from "./SignupLast";
import axios from "axios";
import { Last } from "node_modules/socket.io-client/build/esm/socket";
import Popup from "@components/Popup";
import axiosInstance from "@utils/axios";

export type CommonSignupDataType = {
  name: string;
  age: string;
  role: number;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type SkillType = {
  name: string;
  level: number;
};
export type EducationType = {
  degree: string;
  institution: string;
  from: number;
  to: number;
};

export type WorkExpType = {
  company: string;
  position: string;
  from: number;
  to: number;
};

interface LastSignupPageMethods {
  checkForSubmit: () => boolean;
}

export default function Signup() {
  const [page, setPage] = useState(0);
  const [prevPage, setPrevPage] = useState(-1);
  const [changeVarints, setChagneVariants] = useState(-1);
  const lastSignupPageRef = useRef<LastSignupPageMethods | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState({
    title: "",
    mssg: "",
  });
  const [commonData, setCommonData] = useState<CommonSignupDataType>({
    name: "",
    age: "",
    role: 1,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [teacherFormData, setTeacherFormData] = useState<{
    skills: SkillType[];
    workExp: WorkExpType[];
    education: EducationType[];
  }>({
    skills: [],
    workExp: [],
    education: [],
  });

  const navigate = useNavigate();
  useEffect(() => {
    setPrevPage(page);
  }, [page]);

  const direction = page > prevPage ? 1 : -1;

  const variants = {
    initial: {
      opacity: 0,
      x: direction * 100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.25,
      },
    },
    exit: {
      opacity: 0,
      x: direction * 100,
      transition: {
        duration: 0.2,
      },
    },
  };

  function handleSubmit() {
    // console.log(teacherFormData);
    // return;
    axiosInstance
      .post("/auth/signup", {
        ...commonData,
        ...teacherFormData,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        setShowPopup(true);
        setError(e.response.data);
      });
  }

  const backPageVariants = {
    ...variants,
    exit: { ...variants.exit, x: 200 },
  };

  const pages = [
    <BasicSignup commonData={commonData} setCommonData={setCommonData} />,
  ].concat(
    commonData.role === 0
      ? [
          <TeacherSignupSkills
            skills={teacherFormData.skills}
            setSkills={(skill) =>
              setTeacherFormData((prv) => ({
                ...prv,
                skills: [...prv.skills, skill],
              }))
            }
          />,
          <TeacherSignupWorkExp
            works={teacherFormData.workExp}
            setWorks={(workExp) =>
              setTeacherFormData((prv) => ({
                ...prv,
                workExp: [...prv.workExp, workExp],
              }))
            }
          />,
          <TeacherSignupEdu
            educations={teacherFormData.education}
            setEducation={(education) =>
              setTeacherFormData((prv) => ({
                ...prv,
                education: [...prv.education, education],
              }))
            }
          />,
          <SignupLast
            handleSubmit={handleSubmit}
            commonData={commonData}
            setCommonData={setCommonData}
            ref={lastSignupPageRef}
          />,
        ]
      : [
          <SignupLast
            ref={lastSignupPageRef}
            handleSubmit={handleSubmit}
            commonData={commonData}
            setCommonData={setCommonData}
          />,
        ]
  );

  const headings = [""].concat(
    commonData.role === 0
      ? ["Skills", "Work Experience", "Education", ""]
      : [""]
  );

  return (
    <div className="signup auth">
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
      {headings[page] == "" ? (
        <h1 className="tittle">Sign Up</h1>
      ) : (
        <p className="tittle">{headings[page]}</p>
      )}
      <AnimatePresence>
        <motion.div
          key={page}
          variants={changeVarints == page ? backPageVariants : variants}
          // variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="column"
        >
          {pages[page]}
        </motion.div>
      </AnimatePresence>
      <div className="btns">
        <div className="inner">
          {page > 0 ? (
            <button
              className="go-back"
              onClick={() => {
                setChagneVariants(page);
                setTimeout(() => {
                  setPage((currPage) => currPage - 1);
                  setChagneVariants(-1);
                }, 50);
              }}
            >
              Go Back
            </button>
          ) : (
            <span className="empty-btn"></span>
          )}

          <button
            className="next"
            onClick={() => {
              if (page < pages.length - 1) setPage((currPage) => currPage + 1);
              else {
                if (!lastSignupPageRef.current) return;
                if (lastSignupPageRef.current?.checkForSubmit()) handleSubmit();
              }
            }}
          >
            {pages.length - 1 == page ? "Submit" : "Next"}
          </button>
        </div>
        <center className="auth-link-outer">
          <Link to="/signin" className="auth-link">
            Already have an account ? SignIn
          </Link>
        </center>
      </div>
    </div>
  );
}
