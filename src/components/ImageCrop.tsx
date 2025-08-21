import useData from "@hooks/useData";
import { useScroll } from "framer-motion";
import React, { useState } from "react";
import Cropper from "react-easy-crop";

export default function ImageCrop() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectArea, setAspectArea] = useState(3 / 3.5);
  const { selectedFile, setSelectedFile } = useData();
  return (
    <div className="image-edit">
      <div className="container">
        <Cropper
          onZoomChange={setZoom}
          aspect={aspectArea}
          zoom={zoom}
          crop={crop}
          minZoom={0.6}
          style={{
            containerStyle: {
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            },
          }}
          onCropChange={setCrop}
          onCropComplete={(croppedAreaPercentage, croppedAreaPixels) =>
            setCrop(croppedAreaPixels)
          }
          image={selectedFile}
        />
      </div>

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files[0]);
            const file = e.target.files[0];
            const fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.onload = (e) => {
              const file = fileReader.result;
              console.log(file);
              setSelectedFile(file as string);
              // const storageRef = ref(storage, "chat/" + id + "/" + file);
              // uploadBytes(storageRef, e.target?.result).then((snapshot) => {
              //   console.log("Uploaded a blob or file!");
              // });
            };
          }
        }}
      />
    </div>
  );
}
