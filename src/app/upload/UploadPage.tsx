import React, { useCallback, useRef, useState } from "react";
import "./upload.scss";
import ImageCrop from "@components/ImageCrop";
import ImageCrop2 from "@components/ImageCrop2";
import useData from "@hooks/useData";
import { RiUploadCloudLine } from "react-icons/ri";
import { MdCropFree } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { storage } from "../../../firebase";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import axios from "axios";
import getFileImg from "@utils/getFileIcon";

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [imgSelected, setImgSelected] = useState(false);
  const { selectedFile, setSelectedFile } = useData();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [caption, setCaption] = useState("");
  const [fileDetails, setFileDetails] = useState({
    name: "",
    ext: "",
    isImg: false,
    size: 0,
    type: "",
  });

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!dragOver) setDragOver(true);
    },
    [dragOver]
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const ext = file.name.split(".").pop() as string;
      setImgSelected(true);
      setFileDetails({
        name: file.name,
        ext: ext,
        type: file.type,
        isImg:
          file.type.startsWith("image") ||
          ["png", "jpg", "jpeg", "gif", "webp"].includes(ext),
        size: file.size,
      });
      setSelectedFile(reader.result as string);
      // setSelectedFile(URL.createObjectURL(file));
    };
  }, []);

  const handleInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        setImgSelected(true);
        const ext = file.name.split(".").pop() as string;
        setFileDetails({
          name: file.name,
          ext: ext,
          type: file.type,
          isImg: true,
          size: file.size,
        });
      };
    }
  };

  // getDownloadURL(snapshot.ref)

  async function onSubmit() {
    // if (fileDetails.isImg) {
    //   setIsCropping(true);
    // } else {
    const fileBlob = await (await fetch(selectedFile as string)).blob();
    const storgeRef = ref(storage, `posts/${Date.now()}-${fileDetails.name}`);
    uploadBytesResumable(storgeRef, fileBlob).on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {},
      async () => {
        const url = await getDownloadURL(storgeRef);
        axios.post(
          `${import.meta.env.VITE_SERVER}/posts/upload/`,
          {
            url,
            caption: caption,
            size: fileDetails.size,
            filename: fileDetails.name,
            type: fileDetails.type,
            ext: fileDetails.ext,
          },
          {
            withCredentials: true,
          }
        );
      }
    );
    // }
  }

  return (
    <div className={`upload-page ${dragOver ? "drag-over" : ""}`}>
      {/* {!imgSelected && ( */}
      <div className="upload-container">
        <div
          className={`upload-area ${dragOver ? "drag-over" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!imgSelected && (
            <div className="column">
              <button
                className="upload-img-btn"
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                Upload Image
                <div className="icon">
                  <RiUploadCloudLine />
                </div>
              </button>
              <input
                ref={inputRef}
                style={{
                  display: "none",
                }}
                type="file"
                accept="image/*"
                onChange={handleInputChanged}
              />

              <p className="drag-mssg">Drag and drop image here </p>
            </div>
          )}
          {imgSelected && fileDetails.isImg && <img src={selectedFile} />}
          {imgSelected && !fileDetails.isImg && (
            <div className="file-preview-container">
              <div className="file-preview">
                <div className="file-icon">
                  <img src={getFileImg(fileDetails.type, fileDetails.ext)} />
                </div>
                <div className="file-details">
                  <p className="file-name">{fileDetails.name}</p>
                  <p className="file-size">{fileDetails.size / 1000} kb</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* )} */}
      {/* {imgSelected && fileDetails.isImg && <img src={selectedFile} />}
      {imgSelected && !fileDetails.isImg && (
        <div className="file-preview-container">
          <div className="file-preview">
            <div className="file-icon">
              <img src={getFileImg(fileDetails.type, fileDetails.ext)} />
            </div>
            <div className="file-details">
              <p className="file-name">{fileDetails.name}</p>
              <p className="file-size">{fileDetails.size / 1000} kb</p>
            </div>
          </div>
        </div>
      )} */}
      <textarea
        placeholder="Enter Caption"
        autoCapitalize="sentences"
        autoCorrect="on"
        spellCheck={true}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <div className="actions">
        {imgSelected && fileDetails.isImg && (
          <button className="crop-btn icon-btn">
            Crop
            <div className="icon">
              <MdCropFree />
            </div>
          </button>
        )}

        <button
          className="send-btn icon-btn"
          onClick={() => {
            onSubmit();
          }}
        >
          Send
          <div className="icon">
            <IoSend />
          </div>
        </button>
      </div>
      {/* {
        <ImageCrop2
          image={selectedFile as string}
          caption="Testing Caption"
          onCancel={() => {}}
          onSend={() => {}}
          imgSize={20000}
          onCaptionChange={(s) => {}}
        />
      } */}
    </div>
  );
}
