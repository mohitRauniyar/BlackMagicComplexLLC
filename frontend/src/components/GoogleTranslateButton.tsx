// components/GoogleTranslateButton.tsx
import React from 'react';
import { useEffect } from 'react';

const GoogleTranslateButton = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const frame = document.querySelector('iframe.goog-te-banner-frame');
      if (frame) {
        (frame.parentNode as HTMLElement).style.display = 'none';
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="google_translate_element" className="google-translate" />
  );
};

export default GoogleTranslateButton;
