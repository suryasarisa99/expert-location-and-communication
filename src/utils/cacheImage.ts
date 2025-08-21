async function saveImageToLocalStorage(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          localStorage.setItem(imageUrl, reader.result as string);
          resolve(reader.result as string);
        };
      });
  });
}
function loadImageFromLocalStorage(imageUrl: string) {
  const cachedImage = localStorage.getItem(imageUrl);
  if (cachedImage) {
    return cachedImage;
  }
  return null;
}

function getImg(imageUrl: string): Promise<string> {
  const cachedImage = loadImageFromLocalStorage(imageUrl);
  if (cachedImage) {
    return Promise.resolve(cachedImage);
  }
  return saveImageToLocalStorage(imageUrl);
}
