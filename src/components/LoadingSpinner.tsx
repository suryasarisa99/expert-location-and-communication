import React from "react";

export default function LoadingSpinner({
  fullscreen = false,
  absolute = false,
}: {
  fullscreen?: boolean;
  absolute?: boolean;
}) {
  return (
    <div
      className={`loading-spinner ${fullscreen ? "fullscreen" : ""}`}
      style={{
        position: absolute ? "absolute" : "fixed",
      }}
    >
      <div className="spinner"></div>
    </div>
  );
}
