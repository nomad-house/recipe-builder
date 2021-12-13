import { FC } from "react";
import BaseImage, { ImageLoaderProps } from "next/image";
import { useConfig } from "../hooks/useConfig";

// TODO: Figure this out
const loader = ({ appUrl, src, width, quality }: ImageLoaderProps & { appUrl: string }) => {
  return `${appUrl}${src.startsWith("/") ? src : `/${src}`}?w=${width}&q=${quality}`;
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
  const { appUrl } = useConfig();
  return (
    <BaseImage
      {...props}
      loader={() =>
        loader({
          appUrl,
          src: props.src,
          width: props.width,
          quality: props.quality
        })
      }
    />
  );
};

export default Image;
