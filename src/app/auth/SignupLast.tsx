import PasswordInput from "@components/PasswordInput";
import React, { useState } from "react";
import { CommonSignupDataType } from "./Signup";
import { preview } from "vite";

type SignupLastProps = {
  commonData: CommonSignupDataType;
  setCommonData: React.Dispatch<React.SetStateAction<CommonSignupDataType>>;
};

export default function SignupLast({
  commonData,
  setCommonData,
}: SignupLastProps) {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  return (
    <div className="signup-last signup-basic">
      <input
        type="email"
        name="gmail"
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
    </div>
  );
}
