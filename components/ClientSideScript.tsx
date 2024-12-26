
'use client';

import { useEffect } from 'react';

const ClientSideScript = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('p, img, div, span, input, button, textarea');
    elements.forEach(el => {
      el.setAttribute('draggable', 'false');
    });
  }, []);

  return null; 
}

export default ClientSideScript