import { PixelCrop } from "react-image-crop";

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
  console.log("canvas inc size: ", scaleX * pixelRatio, scaleY * pixelRatio);

  console.log("img size: ", image.naturalWidth, image.naturalHeight);

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  console.log("final canv size: ", canvas.width, canvas.height);

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

const setCanvasPreview2 = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Calculate scale factors
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Calculate the position and size of the cropped area in natural size
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
};

export default setCanvasPreview;
export { setCanvasPreview2 };
