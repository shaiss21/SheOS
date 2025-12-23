
import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface AIAssistantButtonProps {
  onClick: () => void;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setIsDragging(false);
    dragStartPos.current = { 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (buttonRef.current?.hasPointerCapture(e.pointerId)) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // Calculate drag threshold
      if (!isDragging) {
        const moveDist = Math.hypot(
          e.clientX - (dragStartPos.current.x + position.x), 
          e.clientY - (dragStartPos.current.y + position.y)
        );
        if (moveDist > 5) setIsDragging(true);
      }

      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    if (!isDragging) {
      onClick();
    }
    setIsDragging(false);
  };

  return (
    <button
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}

      className="fixed z-50 flex items-center justify-center rounded-full shadow-2xl transition-transform duration-75 active:scale-95"
      style={{
        width: '60px',
        height: '60px',
        background: 'white',
        border: '2px solid #FBE5F0',
        boxShadow: '0 4px 15px rgba(192, 8, 117, 0.15)',
        bottom: '90px', // Initial Position Base
        left: '24px',   // Initial Position Base
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none',
        cursor: 'grab'
      }}
      aria-label="Open AI Assistant"
    >
      <div className="relative z-10 text-[#C00875] pointer-events-none select-none">
        <Sparkles size={28} strokeWidth={2} className="fill-pink-50" />
      </div>
    </button>
  );
};

export default AIAssistantButton;
