import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";

type UploadTask = {
  file: string;
  fileName: string;
  directory: string;
  size: number;
  onFirebaseUploaded: (url: string) => void;
  cleanUpAction: () => void;
};
export default function useUpload() {
  const [progress, setProgress] = useState(-1);
  const [upload, setUpload] = useState<UploadTask | null>(null);
  const timerRef = useRef<number>(-1);

  useEffect(() => {
    async function hanleUpload() {
      if (!upload) return;
      const fileBlob = await (await fetch(upload.file as string)).blob();
      console.log("size: ", fileBlob.size / 1000, " kb");
      const storgeRef = ref(
        storage,
        `${upload.directory}/${Date.now()}-${upload.fileName}`
      );

      if (upload.size < 400000)
        timerRef.current = window.setInterval(() => {
          setProgress((prv) => {
            if (prv == 100) {
              clearInterval(timerRef.current);
              return -1;
            }
            if (prv + 10 <= 70) return Math.max(prv + 10, prv);
            else {
              clearInterval(timerRef.current);
              return prv;
            }
          });
        }, 150);

      uploadBytesResumable(storgeRef, fileBlob).on(
        "state_changed",
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.max(p - 10, 0));
          console.log("Upload is " + p + "% done");
        },
        (error) => {},
        async () => {
          window.setTimeout(() => {
            setProgress(95);
          }, 80);
          const url = await getDownloadURL(storgeRef);

          upload.onFirebaseUploaded(url);

          window.setTimeout(() => {
            setProgress(100);
            window.setTimeout(() => {
              setProgress(-1);
            }, 150);
          }, 120);
          upload.cleanUpAction();
        }
      );
    }
    if (progress === -1 && upload && upload.file) hanleUpload();
  }, [upload]);

  return { progress, setUpload };
}
