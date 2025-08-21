import { ContextMenu } from "@components/ContextMenu";
import { MssgType } from "@src/types/StudentType";
import { CopyIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
export default function Message({
  mssg,
  role,
  selectedText,
  progress,
  i,
  len,
}: {
  mssg: MssgType;
  selectedText: React.MutableRefObject<string | null>;
  role: number;
  progress: number;
  i: number;
  len: number;
}) {
  const imgUrl = useRef<string | null>(null);
  //   useEffect(() => {
  //     if (mssg.img) {
  //       cacheImage(mssg.img).then((url) => {
  //         console.log("url: ", url);
  //         imgUrl.current = url;
  //       });
  //     }
  //   }, [mssg.img]);
  const messageActions = [
    {
      label: "Copy Message",
      action: () => handleCopyText(mssg.mssg),
      icon: <CopyIcon size={14} />,
    },
    {
      label: "Copy Selected Text",
      action: () => handleCopyText(selectedText?.current || ""),
      icon: <CopyIcon size={14} />,
    },
    ...(mssg.img
      ? [
          {
            action: () => window.open(mssg.img, "_blank"),
            label: "Open Image",
          },
        ]
      : []),
    {
      action: () => {},
      label: "Reply",
    },
  ];
  return (
    <ContextMenu
      className={
        "mssg " +
        (mssg.img ? "img-mssg " : "") +
        ((mssg.isStudent && role == 1) || (!mssg.isStudent && role == 0)
          ? "right-mssg"
          : "left-mssg")
      }
      getText={(s) => (selectedText.current = s)}
      items={messageActions}
    >
      {mssg.ai && <p className="ai-mssg">This is Ai Message</p>}
      {mssg.img && <img className="img" src={mssg.img || ""} />}
      <code className="mssg-text">{mssg.mssg}</code>
      {i === len - 1 && progress !== -1 && (
        <div className="loader">
          <progress value={progress} max={100} />
        </div>
      )}
      {/* <p className="mssg-time">{mssg.time}</p> */}
    </ContextMenu>
  );
}

function handleCopyText(text: string) {
  navigator.clipboard.writeText(text);
}
