interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const textColor = light ? 'text-white' : 'text-ivory';
  const subtitleColor = light ? 'text-white/80' : 'text-white/70';
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const lineAlign = align === 'center' ? 'mx-auto' : 'ml-0';

  return (
    <div className={alignClass}>
      <h2 className={`font-serif text-3xl md:text-4xl ${textColor} mb-3`}>
        {title}
      </h2>
      <div className={`w-16 h-0.5 bg-gold ${lineAlign} mb-4`} />
      {subtitle && (
        <p className={`${subtitleColor} text-base max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
