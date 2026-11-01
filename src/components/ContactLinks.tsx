import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import profile from '../data/profile.json';

function ContactIcon({ name }: { name: string }) {
  return <span className="contact-icon" aria-hidden="true" style={{ '--icon-url': `url('/icons/${name}.svg')` } as CSSProperties} />;
}

export default function ContactLinks() {
  const [feedback, setFeedback] = useState('');
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
      setFeedback(copied ? '微信号已复制，请在微信中搜索添加。' : '复制失败，请允许浏览器访问剪贴板后重试。');
      setBusy(false);
    }
  };

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-heading">
        <h2 id="contact-title">Let’s connect.</h2>
        <p>Research, projects, or a conversation.</p>
      </div>
      <div className="contact-links">
        <div className="contact-wechat">
          <button type="button" className="contact-link" onClick={copyWeChat} disabled={busy} aria-describedby="wechat-feedback" aria-label="复制微信号">
            <ContactIcon name="wechat" />
            <span>微信<span className="contact-caption">点击复制微信号</span></span>
            {feedback.startsWith('微信号已复制') ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          </button>
        </div>
        <a className="contact-link" href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}>
          <ContactIcon name="mail" /><span>Email<span className="contact-caption">{profile.email}</span></span><ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a className="contact-link" href={profile.social.xiaohongshu} target="_blank" rel="noopener noreferrer" aria-label="小红书主页（新窗口）">
          <ContactIcon name="xiaohongshu" /><span>小红书<span className="contact-caption">访问我的主页</span></span><ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a className="contact-link" href={profile.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)">
          <ContactIcon name="github" /><span>GitHub<span className="contact-caption">DannyWANGD</span></span><ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <p id="wechat-feedback" className="contact-feedback" role="status">{feedback}</p>
    </section>
  );
}
