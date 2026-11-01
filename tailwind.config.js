import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {
    fontFamily: {
      serif: ['Site Song', 'Georgia', 'SimSun', 'serif'],
      sans: ['Site Song', 'Inter', 'Segoe UI', 'SimSun', 'serif'],
      mono: ['Site Song', 'Cascadia Code', 'Consolas', 'SimSun', 'monospace'],
    },
    colors: { primary: '#204d63', secondary: { DEFAULT: '#faf9f6', foreground: '#242a2c' }, muted: { DEFAULT: '#f1f0eb', foreground: '#626c70' } },
  } },
  plugins: [typography],
};
