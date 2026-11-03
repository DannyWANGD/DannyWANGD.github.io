import { useState, type ImgHTMLAttributes } from 'react';
import useLanguage from '../hooks/useLanguage';

export default function SiteImage({ alt, className = '', fetchPriority, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);
  return failed ? <span className={`image-fallback ${className}`} role="img" aria-label={alt || t.common.imageUnavailable}>{t.common.imageUnavailable}</span> : <img {...props} {...(fetchPriority ? { fetchpriority: fetchPriority } : {})} alt={alt || ''} className={className} decoding="async" onError={() => setFailed(true)} />;
}
