import { MssgType } from "@src/types/StudentType";
import React, { useLayoutEffect } from "react";
import Message from "./Message";

export default function Messages({
  messages,
  scrollDivRef,
  role,
  selectedText,
  progress,
  isLgScreen,
}: {
  messages: MssgType[];
  scrollDivRef: React.RefObject<HTMLDivElement>;
  role: number;
  selectedText: React.MutableRefObject<string | null>;
  progress: number;
  isLgScreen: boolean;
}) {
  useLayoutEffect(() => {
    if (!isLgScreen) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant", // optional
      });
    } else {
      //   const scrollElm = document.querySelector(".container-page")!;
      const scrollElm = scrollDivRef.current!;
      scrollElm!.scrollTo({
        top: scrollElm.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="mssgs" ref={scrollDivRef}>
      {messages.map((mssg, i) => {
        return (
          <Message
            key={i}
            mssg={mssg}
            role={role}
            selectedText={selectedText}
            progress={progress}
            i={i}
            len={messages.length}
          />
        );
      })}
    </div>
  );
}
