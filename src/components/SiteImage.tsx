import { useState, type ImgHTMLAttributes } from 'react';

export default function SiteImage({ alt, className = '', fetchPriority, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className={`image-fallback ${className}`} role="img" aria-label={alt || 'Image unavailable'}>Image unavailable</span> : <img {...props} {...(fetchPriority ? { fetchpriority: fetchPriority } : {})} alt={alt || ''} className={className} decoding="async" onError={() => setFailed(true)} />;
}
