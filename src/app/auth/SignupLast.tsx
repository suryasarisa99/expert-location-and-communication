import PasswordInput from "@components/PasswordInput";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CommonSignupDataType } from "./Signup";
import { preview } from "vite";
import Popup from "@components/Popup";
import { b } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

type SignupLastProps = {
  commonData: CommonSignupDataType;
  setCommonData: React.Dispatch<React.SetStateAction<CommonSignupDataType>>;
  handleSubmit: () => void;
};

const SignupLast = forwardRef(
  ({ commonData, setCommonData, handleSubmit }: SignupLastProps, ref) => {
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState({
      title: "",
      mssg: "",
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          checkForSubmit: checkForSubmit,
        };
      },
      [commonData]
    );

    function checkForSubmit(): boolean {
      console.log("submit");
      const email = commonData.email;
      const username = commonData.username;
      const password = commonData.password;
      const confirmPassword = commonData.confirmPassword;
      if (
        email == "" ||
        username == "" ||
        password == "" ||
        confirmPassword == ""
      ) {
        setError({
          title: "All fields are required",
          mssg: "Please fill all the fields, to Continue",
        });

        setShowPopup(true);
        return false;
      }

      if (password !== confirmPassword) {
        setError({
          title: "Password not matched",
          mssg: "Please enter the same password in both fields",
        });
        setShowPopup(true);
        return false;
      }
      return true;
    }
    return (
      <form
        className="signup-last signup-basic"
        onSubmit={(e) => {
          e.preventDefault();
          if (checkForSubmit()) {
            handleSubmit();
          }
        }}
      >
        <Popup
          handleClose={() => setShowPopup(false)}
          show={showPopup}
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
                OK
              </button>
            </div>
          </div>
        </Popup>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={commonData.email}
          onChange={(e) => {
            setCommonData((prv) => ({ ...prv, email: e.target.value }));
          }}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={commonData.username}
          onChange={(e) => {
            setCommonData((prv) => ({ ...prv, username: e.target.value }));
          }}
        />
        <PasswordInput
          value={commonData.password}
          onChange={(pass) => {
            setCommonData((prv) => ({ ...prv, password: pass }));
          }}
        />
        <PasswordInput
          value={commonData.confirmPassword}
          onChange={(pass) => {
            setCommonData((prv) => ({ ...prv, confirmPassword: pass }));
          }}
          placeholder="Cofirm Password"
        />
        <button style={{ display: "none" }}></button>
      </form>
    );
  }
);

export default SignupLast;
