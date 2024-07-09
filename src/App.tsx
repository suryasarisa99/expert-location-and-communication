import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./colors.css";
import Chat from "@app/Chat";
import Signup from "@app/auth/Signup";
import { GiSkills } from "react-icons/gi";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/chat/*" element={<Chat />} />
      </Routes>
    </div>
  );
}
{
  /* <Route path="/chat/:id" element={<ChatSection />} /> */
}
