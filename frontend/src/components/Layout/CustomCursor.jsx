import React, { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Only run on desktop screens (larger than 1024px)
    if (window.innerWidth < 1024) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update small dot immediately
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    // Smooth animation loop for the outer cursor ring (creates organic lag)
    const animateCursor = () => {
      const ease = 0.15; // interpolation factor
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animationFrame = requestAnimationFrame(animateCursor);

    // Hover event listeners on interactive items to expand ring
    const onMouseEnterLink = () => {
      cursor.style.width = '48px';
      cursor.style.height = '48px';
      cursor.style.backgroundColor = 'rgba(92, 26, 36, 0.1)';
      cursor.style.borderColor = '#5C1A24';
    };

    const onMouseLeaveLink = () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.borderColor = '#C9A24B';
    };

    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, select, input, [role="button"], .interactive-hover');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });
    };

    // Listen for DOM changes to re-bind hover classes
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial binding
    addHoverListeners();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden lg:block" />
      <div ref={dotRef} className="custom-cursor-dot hidden lg:block" />
    </>
  );
};
export default CustomCursor;
