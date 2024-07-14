import useData from "@hooks/useData";
import setCanvasPreview, { setCanvasPreview2 } from "@utils/setCanvasPreview";
import React, { useRef, useState } from "react";
import ReactCrop, { convertToPixelCrop, Crop } from "react-image-crop";

type CropProfilePicProps = {
  image: string;
  onCancel: () => void;
  onSend: (croppedImg: string) => void;
};

export default function CropProfilePic({
  image,
  onCancel,
  onSend,
}: CropProfilePicProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const img = e.target as HTMLImageElement;

    // let percentage = 0;
    // if (img.height < img.width) percentage = (img.height / img.width) * 100;
    // else percentage = (img.width / img.height) * 100;

    // setCrop({
    //   unit: "%",
    //   x: 0,
    //   y: 0,
    //   width: percentage,
    //   height: 0,
    // });

    let hPer = 0;
    let wPer = 0;
    if (img.width < img.height) {
      wPer = 100;
      hPer = (img.width / img.height) * 100;
    } else {
      hPer = 100;
      wPer = (img.height / img.width) * 100;
    }

    console.log(wPer, hPer);

    setCrop({
      unit: "%",
      x: (100 - wPer) / 2,
      y: (100 - hPer) / 2,
      width: wPer,
      height: hPer,
    });
  }

  function handleOnSend() {
    if (!imgRef.current || !canvasRef.current) return;
    setCanvasPreview2(
      imgRef.current,
      canvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );
    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.7);
    onSend(dataUrl);
    onCancel();
  }

  return (
    <div className="profile-crop">
      <div className="inner">
        <div className="container">
          <ReactCrop
            circularCrop
            //   disabled={true}
            crop={crop}
            aspect={1}
            style={{
              maxHeight: "70vh",
              margin: "auto auto",
            }}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
          >
            <img src={image} ref={imgRef} onLoad={onImgLoad} />
          </ReactCrop>
        </div>
        <div className="actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="send-btn" onClick={handleOnSend}>
            Done
          </button>
        </div>

        <canvas
          ref={canvasRef}
          style={{
            display: "none",
          }}
        ></canvas>
      </div>
    </div>
  );
}
