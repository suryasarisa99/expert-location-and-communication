import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type PopupProps = {
  show: boolean;
  handleClose: () => void;
  closeOnEscape: boolean;
  closeOnClickOutside: boolean;
  children: React.ReactNode;
  className: string;
};

export default function Popup({
  show,
  handleClose,
  closeOnEscape,
  closeOnClickOutside,
  children,
  className,
}: PopupProps) {
  function completeClose() {
    document.getElementById("overlay")!.classList.add("hidden");
    document.documentElement.style.overflow = "initial";
    handleClose();
  }

  useEffect(() => {
    if (show) {
      document.getElementById("overlay")!.classList.remove("hidden");
      document.documentElement.style.overflow = "hidden";
    } else {
      document.getElementById("overlay")!.classList.add("hidden");
      document.documentElement.style.overflow = "initial";
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") completeClose();
    }
    function handleClick(e: MouseEvent) {
      const popupBox = document.querySelector(".popup-box");
      console.log("status: ", popupBox?.contains(e.target as Node));
      if (
        e.target === document.getElementById("overlay") &&
        !popupBox?.contains(e.target as Node)
      ) {
        console.log("closed");
        completeClose();
      }
    }
    if (closeOnEscape) window.addEventListener("keydown", handleEscape);
    if (closeOnClickOutside)
      document
        .getElementById("overlay")!
        .addEventListener("click", handleClick);

    return () => {
      document
        .getElementById("overlay")!
        .removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [show]);

  return (
    <div className="popup">
      {}
      {show &&
        createPortal(
          <div className={"popup-box  " + className}>{children}</div>,
          document.querySelector("#overlay")!
        )}
    </div>
  );
}
