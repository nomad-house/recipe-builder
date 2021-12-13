import { FC } from "react";
import BaseImage, { ImageLoader } from "next/image";

// TODO: Figure this out
const loader: ImageLoader = ({ src, width, quality }) => {
  return `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}${
    src.startsWith("/") ? src : `/${src}`
  }?w=${width}&q=${quality}`;
};

type BaseImageProps = Parameters<typeof BaseImage>[0];
interface ImageProps extends BaseImageProps {
  // relative url path of the image
  src: string;
  // width of the image
  width: number;
  // quality of the image
  quality?: number;
}

const Image: FC<ImageProps> = (props) => {
  return (
    <BaseImage
      {...props}
      loader={() =>
        loader({
          src: props.src,
          width: props.width,
          quality: props.quality
        })
      }
    />
  );
};

export default Image;
