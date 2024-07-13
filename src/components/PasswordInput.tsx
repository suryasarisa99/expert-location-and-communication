import React from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

type PasswordInputProps = {
  value: string;
  // onChange: React.Dispatch<React.SetStateAction<string>>;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="password-input">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="eye-icon" onClick={() => setShowPassword((prv) => !prv)}>
        {!showPassword ? <IoMdEyeOff /> : <IoMdEye />}
      </div>
    </div>
  );
}
