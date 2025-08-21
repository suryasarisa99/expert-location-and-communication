import React, { useState } from "react";
import { motion } from "framer-motion";
import "./ImageViewer.css";

export default function ImageViewer() {
  return (
    <div className="image-viewer-screen">
      <img src="https://via.placeholder.com/150" alt="placeholder" />
    </div>
  );
}
