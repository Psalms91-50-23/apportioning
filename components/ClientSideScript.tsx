// components/ClientSideScript.tsx

'use client'; // This directive is necessary for client-side rendering

import { useEffect } from 'react';

const ClientSideScript = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('p, img, div, span, input, button, textarea');
    elements.forEach(el => {
      el.setAttribute('draggable', 'false');
    });
  }, []);

  return null; // This component does not render anything to the DOM
}

export default ClientSideScript