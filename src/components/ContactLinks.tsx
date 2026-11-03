import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import profile from '../data/profile.json';
import useLanguage from '../hooks/useLanguage';

function ContactIcon({ name }: { name: string }) {
  return <span className="contact-icon" aria-hidden="true" style={{ '--icon-url': `url('/icons/${name}.svg')` } as CSSProperties} />;
}

export default function ContactLinks() {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState<'copied' | 'failed' | ''>('');
  const [busy, setBusy] = useState(false);

  const copyWeChat = async () => {
    setBusy(true);
    let copied = false;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(profile.details.wechat);
      copied = true;
    } catch {
      // Older browsers may allow copying from a temporary offscreen selection.
      const selection = document.createElement('textarea');
      const previousFocus = document.activeElement;
      selection.value = profile.details.wechat;
      selection.readOnly = true;
      selection.tabIndex = -1;
      selection.setAttribute('aria-hidden', 'true');
      selection.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
      document.body.append(selection);
      try {
        selection.focus({ preventScroll: true });
        selection.select();
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      } finally {
        selection.remove();
        if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
      }
    } finally {
      setFeedback(copied ? 'copied' : 'failed');
      setBusy(false);
    }
  };

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-heading">
        <h2 id="contact-title">{t.contact.title}</h2>
        <p>{t.contact.description}</p>
      </div>
      <div className="contact-links">
        <div className="contact-wechat">
          <button type="button" className="contact-link" onClick={copyWeChat} disabled={busy} aria-describedby="wechat-feedback" aria-label={t.contact.copy}>
            <ContactIcon name="wechat" />
            <span>{t.contact.wechat}<span className="contact-caption">{t.contact.copy}</span></span>
            {feedback === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          </button>
        </div>
        <a className="contact-link" href={`mailto:${profile.email}`} aria-label={`${t.common.email} ${profile.email}`}>
          <ContactIcon name="mail" /><span>{t.common.email}<span className="contact-caption">{profile.email}</span></span><ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a className="contact-link" href={profile.social.xiaohongshu} target="_blank" rel="noopener noreferrer" aria-label={t.contact.xiaohongshuLabel}>
          <ContactIcon name="xiaohongshu" /><span>{t.contact.xiaohongshu}<span className="contact-caption">{t.contact.visit}</span></span><ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a className="contact-link" href={profile.social.github} target="_blank" rel="noopener noreferrer" aria-label={t.contact.githubLabel}>
          <ContactIcon name="github" /><span>GitHub<span className="contact-caption">DannyWANGD</span></span><ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <p id="wechat-feedback" className="contact-feedback" role="status">{feedback && t.contact[feedback]}</p>
    </section>
  );
}
