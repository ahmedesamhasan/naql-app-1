type DizieLIconProps = {
  lang: 'ar' | 'en';
  className?: string;
};

const DizieLIcon = ({ lang, className }: DizieLIconProps) => {
  const src = '/images/deziel-no-bg.png';

  const alt = lang === 'ar' ? 'شعار Diziel' : 'DizieL logo';

  return <img src={src} alt={alt} className={className} loading='lazy' decoding='async' />;
};

export default DizieLIcon;
