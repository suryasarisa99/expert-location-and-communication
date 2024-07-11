import PasswordInput from "@components/PasswordInput";
import React, { useState } from "react";

export default function SignupLast() {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  return (
    <div className="signup-last signup-basic">
      <input type="email" name="gmail" placeholder="Email" />
      <input type="text" name="username" placeholder="Username" />
      <PasswordInput value={password} onChange={setPassword} />
      <PasswordInput
        value={confirmPass}
        onChange={setConfirmPass}
        placeholder="Cofirm Password"
      />
    </div>
  );
}
