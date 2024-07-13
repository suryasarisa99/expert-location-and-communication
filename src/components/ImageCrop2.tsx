import useData from "@hooks/useData";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  PixelCrop,
  type Crop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/src/ReactCrop.scss";
import { MdCropFree } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const setCanvasPreview = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  ctx.save();

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
};

type ImageCrop2Props = {
  image: string;
  onSend: () => void;
  onCancel: () => void;
  caption: string;
  onCaptionChange: (caption: string) => void;
  imgSize: number;
};

export default function ImageCrop2({
  image,
  onCancel,
  caption,
  onSend,
  onCaptionChange,
  imgSize,
}: ImageCrop2Props) {
  const { selectedFile, setSelectedFile } = useData();
  const aspectRatios = [1 / 1, 5 / 4, 4 / 3, 3 / 2, 5 / 2];
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const navigate = useNavigate();
  const [aspect, setAspect] = useState(2);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const isCroppingRef = useRef(false);

  // to back in normal mode
  useEffect(() => {
    const handleBackInNormalMode = (event: PopStateEvent) => {
      if (!isCroppingRef.current) {
        console.log("on back");
        onCancel();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        // navigate(-1);
        window.history.back();
      }
    };
    console.log("back listener added : Normal Mode");
    window.history.pushState({ mode: "normal" }, document.title);
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("popstate", handleBackInNormalMode);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("popstate", handleBackInNormalMode);
    };
  }, []);

  // to back in cropping mode
  useEffect(() => {
    isCroppingRef.current = isCropping;
    const handleBackButton = (event: PopStateEvent) => {
      console.log("on back : in cropping");
      if (!isCropping) return;
      setIsCropping(false);
    };
    if (isCropping) {
      console.log("cop mode listener added");
      window.history.pushState({ mode: "cropMode" }, document.title);
      window.addEventListener("popstate", handleBackButton);
    }
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isCropping]);

  function handleCrop() {
    if (!imgRef.current || !canvasRef.current) return;
    setCanvasPreview(
      imgRef.current,
      canvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );
    const dataUrl = canvasRef.current.toDataURL(
      "image/jpeg",
      imgSize < 400000 ? 0.3 : 0.2
    );
    setSelectedFile(dataUrl);
  }

  return (
    <div className="image-crop-2">
      {!isCropping && (
        <div className="normal-mode">
          <img src={image} ref={imgRef} />
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              onSend();
            }}
          >
            <input
              type="text"
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              className="mssg"
              placeholder="Enter Caption"
            />
          </form>
          <div className="bottom">
            <div
              className="to"
              onClick={() => {
                filePickerRef.current?.click();
              }}
            >
              @JayaSurya
            </div>
            <div className="right">
              <div
                className="crop-icon"
                onClick={() => {
                  setIsCropping(true);
                }}
              >
                <MdCropFree />
              </div>
              <div className="send-icon" onClick={onSend}>
                <IoSend />
              </div>
            </div>
          </div>
        </div>
      )}

      {isCropping && (
        <div className="crop-mode">
          <div className="container">
            <ReactCrop
              crop={crop}
              //   aspect={aspectRatios[aspect]}
              //   maxHeight={600}
              //   minHeight={200}
              style={{
                maxHeight: "70vh",
                margin: "auto auto",
                backgroundColor: "green",
                // position: "static",
              }}
              onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            >
              <img src={image} ref={imgRef} />
            </ReactCrop>
          </div>
          <div className="bottom">
            <button className="cancel" onClick={() => setIsCropping(false)}>
              Cancel
            </button>
            <button
              className="crop"
              onClick={() => {
                handleCrop();
                setIsCropping(false);
              }}
            >
              Crop
            </button>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={filePickerRef}
        style={{
          display: "none",
        }}
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
      <canvas
        ref={canvasRef}
        style={{
          display: "none",
        }}
      ></canvas>
    </div>
  );
}
