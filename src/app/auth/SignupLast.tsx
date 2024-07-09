import React from "react";

export default function SignupLast() {
  return (
    <div className="signup-last signup-basic">
      <input type="email" name="gmail" placeholder="Email" />
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <input
        type="password"
        name="confirm-password"
        placeholder="Confirm Password"
      />
    </div>
  );
}
