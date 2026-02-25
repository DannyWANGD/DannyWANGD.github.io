import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary py-8 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Wang Ding. All rights reserved.</p>
        <p className="mt-2">Built with React, Tailwind CSS, and Vite.</p>
      </div>
    </footer>
  );
};

export default Footer;