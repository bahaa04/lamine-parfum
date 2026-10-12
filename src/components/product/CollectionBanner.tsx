interface CollectionBannerProps {
  title: string;
  description: string;
  image: string;
  overlay?: 'dark' | 'light';
}

export default function CollectionBanner({
  title,
  description,
  image,
  overlay = 'dark',
}: CollectionBannerProps) {
  const overlayClass =
    overlay === 'dark'
      ? 'bg-gradient-to-r from-black/70 to-black/30'
      : 'bg-gradient-to-r from-white/70 to-white/30';

  const textColorClass = overlay === 'dark' ? 'text-white' : 'text-ivory';

  return (
    <div
      className="relative w-full h-[300px] md:h-[400px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="relative z-10 section-padding container-luxury w-full">
        <div className="max-w-2xl">
          <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl ${textColorClass} mb-4`}>
            {title}
          </h1>
          <p className={`text-lg md:text-xl ${overlay === 'dark' ? 'text-white/80' : 'text-ivory/80'} max-w-xl`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
