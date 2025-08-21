import React, { useRef, useEffect, useState } from "react";
import ReactDOM, { createPortal } from "react-dom";

export default function usePortal(id: string) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement>();

  useEffect(() => {
    let createdElement = false;
    let portalRoot = document.getElementById(id);

    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", id);
      document.body.appendChild(portalRoot);
      createdElement = true;
    }

    setPortalRoot(portalRoot);

    return () => {
      // if (createdElement && portalRoot) {
      if (portalRoot && portalRoot.children.length === 0) {
        document.body.removeChild(portalRoot);
      }
    };
  }, [id]);

  return portalRoot;
}
