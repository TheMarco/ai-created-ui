import Image from 'next/image';

interface ThemedHeroImageProps {
  darkSrc: string;
  lightSrc?: string;
  overlay?: 'default' | 'strong' | 'soft' | 'none';
  priority?: boolean;
  quality?: number;
  sizes?: string;
  objectPosition?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  blendLight?: boolean;
}

export default function ThemedHeroImage({
  darkSrc,
  lightSrc,
  overlay = 'default',
  priority = false,
  quality = 85,
  sizes = '100vw',
  objectPosition,
  fadeTop = false,
  fadeBottom = false,
  blendLight = false,
}: ThemedHeroImageProps) {
  const imageStyle = objectPosition ? { objectPosition } : undefined;
  const overlayClass = overlay === 'strong'
    ? 'hero-overlay-heavy'
    : overlay === 'soft'
      ? 'hero-overlay-soft'
      : overlay === 'none'
        ? ''
        : 'hero-overlay';

  return (
    <div className={`absolute inset-0 ${blendLight ? 'hero-blend' : ''}`.trim()}>
      <Image
        src={darkSrc}
        alt=""
        aria-hidden="true"
        fill
        priority={priority}
        quality={quality}
        className={`object-cover ${lightSrc ? 'hero-img-dark' : ''}`.trim()}
        style={imageStyle}
        sizes={sizes}
      />
      {lightSrc && (
        <Image
          src={lightSrc}
          alt=""
          aria-hidden="true"
          fill
          quality={quality}
          className="object-cover hero-img-light"
          style={imageStyle}
          sizes={sizes}
        />
      )}
      {overlayClass && <div className={`absolute inset-0 ${overlayClass}`} />}
      {fadeTop && <div className="absolute inset-x-0 top-0 h-1/3 hero-fade-top" />}
      {fadeBottom && <div className="absolute inset-x-0 bottom-0 h-1/3 hero-fade-bottom" />}
    </div>
  );
}
