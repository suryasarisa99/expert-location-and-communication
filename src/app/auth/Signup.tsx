import React, { useState, useEffect, useReducer } from "react";
import BasicSignup from "./BasicSignup";
import TeacherSignupSkills from "./TeacherSignupSkills";
import TeacherSignupWorkExp from "./TeacherSignupWorkExp";
import TeacherSignupEdu from "./TeacherSignupEdu";
import { motion, AnimatePresence } from "framer-motion";
import "./signup.scss";
import { Link, useNavigate } from "react-router-dom";
import SignupLast from "./SignupLast";

export type CommonSignupDataType = {
  name: string;
  age: string;
  role: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const [page, setPage] = useState(0);
  const [prevPage, setPrevPage] = useState(-1);
  const [changeVarints, setChagneVariants] = useState(-1);

  const [commonData, setCommonData] = useState<CommonSignupDataType>({
    name: "",
    age: "",
    role: "1",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [teacherFormData, setTeacherFormData] = useState({
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

  const backPageVariants = {
    ...variants,
    exit: { ...variants.exit, x: 200 },
  };

  const pages = [
    <BasicSignup commonData={commonData} setCommonData={setCommonData} />,
  ].concat(
    commonData.role === "0"
      ? [
          <TeacherSignupSkills />,
          // <TeacherSignupWorkExp />,
          <TeacherSignupEdu />,
          <SignupLast commonData={commonData} setCommonData={setCommonData} />,
        ]
      : [<SignupLast commonData={commonData} setCommonData={setCommonData} />]
  );

  const headings = [""].concat(
    commonData.role === "0"
      ? [
          "Skills",
          // "Work Experience",
          "Education",
          "",
        ]
      : [""]
  );

  return (
    <div className="signup auth">
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
            // <button className="icon-btn"></button>
          )}

          <button
            className="next"
            onClick={() => {
              if (page < pages.length - 1) setPage((currPage) => currPage + 1);
              else navigate("/chat");
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
