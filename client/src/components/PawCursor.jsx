import { useEffect, useRef } from 'react';

/**
 * Premium Custom Paw Cursor Follower.
 * Keeps the default browser cursor pointer intact.
 * Uses requestAnimationFrame and Lerp (Linear Interpolation) to smoothly animate 2 paw print emojis
 * walking/bobbing up and down dynamically beside the mouse cursor.
 */
export default function PawCursor() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Linear interpolation tracking variables for smooth gliding physics
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;
    let isVisible = false;

    const handleMouseMove = (e) => {
      // Offset slightly to the right and bottom of the default browser arrow cursor
      targetX = e.clientX + 22;
      targetY = e.clientY + 12;
      
      if (!isVisible) {
        isVisible = true;
        // Instantly snap to first move to prevent off-screen jump
        currentX = targetX;
        currentY = targetY;
      }
    };

    // Fast GPU-accelerated render loop running at 60fps
    const smoothCursorLoop = () => {
      const ease = 0.35; // Increased from 0.15 for ultra-responsive, realtime tracking with buttery smoothness
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      if (container) {
        container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      requestAnimationFrame(smoothCursorLoop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const frameId = requestAnimationFrame(smoothCursorLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="paw-cursor-container">
      <span className="paw-emoji paw-top">🐾</span>
      <span className="paw-emoji paw-bottom">🐾</span>
    </div>
  );
}
