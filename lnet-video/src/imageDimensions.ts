/**
 * Reads the natural size of an image. Runs inside the browser that Remotion
 * uses to evaluate `calculateMetadata`.
 */
export const getImageDimensions = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error(`Could not load image ${src}`));
    image.src = src;
  });
