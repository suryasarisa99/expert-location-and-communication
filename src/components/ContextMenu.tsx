import { useEffect, useState, useRef, useReducer } from "react";
import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import usePortal from "@hooks/usePortal";

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  disabled?: boolean;
}

export const ContextMenu: React.FC<{
  children?: React.ReactNode;
  global?: boolean;
  items: ContextMenuItem[];
  className?: string;
  getText: (s: string) => void;
}> = ({ children, items, className = "", global = false, getText }) => {
  const contextContainerRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const textRef = useRef<string | null>(null);
  if (!global && !children) {
    throw new Error("Children is required when global prop is not set");
  }
  function getSelectedText() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const selectedText = selection.toString();
      console.log("Selected text:", selectedText);
      return selectedText;
    } else {
      console.log("No text selected");
      return null;
    }
  }

  useEffect(() => {
    const target = global ? document : contextContainerRef.current;
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      let x = e.clientX;
      let y = e.clientY;
      if (window.innerWidth - x < 200) x -= 200;
      if (window.innerHeight - y < 100) y -= 100;
      setPosition({ x: x, y: y });
      console.log({ x: x, y: y });
      setIsVisible(true);
    };
    if (isVisible) {
      textRef.current = getSelectedText();
      getText(textRef.current || "");
    }

    if (target) {
      target.addEventListener(
        "contextmenu",
        handleContextMenu as EventListener
      );

      return () => {
        target.removeEventListener(
          "contextmenu",
          handleContextMenu as EventListener
        );
      };
    }
  }, [isVisible]);

  const ContextMenu = (
    <AnimatePresence>
      {isVisible && (
        <ContextMenuPortalWrapper hide={() => setIsVisible(false)}>
          <motion.div
            ref={contextMenuRef}
            className="context-menu local"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
            style={{
              position: "fixed",
              top: position.y,
              left: position.x,
              zIndex: 1000,
              minWidth: "200px",
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  item.action();
                  setIsVisible(false);
                }}
                className="context-menu-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                {item.icon && (
                  <span style={{ marginRight: "10px", marginTop: "8px" }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </div>
            ))}
          </motion.div>
        </ContextMenuPortalWrapper>
      )}
    </AnimatePresence>
  );

  if (global) return ContextMenu;
  else
    return (
      <div ref={contextContainerRef} className={className}>
        {children}
        {ContextMenu}
      </div>
    );
};

function ContextMenuPortalWrapper({
  children,
  hide,
}: {
  children: React.ReactNode;
  hide: () => void;
}) {
  const portalTarget = usePortal("context-overlay");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.currentTarget === e.target) {
        hide();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        hide();
      }
    }
    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      hide();
      // it shows only when my own context menu is shown
      // so if user again right clicks (open context), it will hides my own context menuss
    }
    if (!portalTarget) return;

    portalTarget.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleEscape);
    portalTarget.addEventListener("contextmenu", handleContextMenu);

    return () => {
      portalTarget.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEscape);
      portalTarget.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [portalTarget]);

  if (!portalTarget) return null;

  return createPortal(children, portalTarget);
}
