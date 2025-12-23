
import React, { useState, useRef } from 'react';
import { Bell } from 'lucide-react';

interface SOSButtonProps {
  onTrigger: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onTrigger }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for stable drag calculation
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const buttonStartRef = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as Element;
    target.setPointerCapture(e.pointerId);
    
    setIsDragging(false);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    buttonStartRef.current = { x: position.x, y: position.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (buttonRef.current?.hasPointerCapture(e.pointerId)) {
      e.preventDefault();
      e.stopPropagation();

      const deltaX = e.clientX - pointerStartRef.current.x;
      const deltaY = e.clientY - pointerStartRef.current.y;
      const moveDist = Math.hypot(deltaX, deltaY);

      // Increase threshold to 10px to prevent accidental drags on tap
      if (!isDragging && moveDist > 10) {
        setIsDragging(true);
      }

      if (isDragging || moveDist > 10) {
         setPosition({ 
           x: buttonStartRef.current.x + deltaX, 
           y: buttonStartRef.current.y + deltaY 
         });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as Element;
    target.releasePointerCapture(e.pointerId);

    if (!isDragging) {
      onTrigger();
    }
    setIsDragging(false);
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
      const target = e.currentTarget as Element;
      target.releasePointerCapture(e.pointerId);
      setIsDragging(false);
  };

  return (
    <button
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className="fixed z-[100] flex items-center justify-center rounded-full shadow-2xl transition-transform duration-75 active:scale-95 touch-none"
      style={{
        width: '70px',
        height: '70px',
        background: 'linear-gradient(135deg, #FF0F9A, #E70B88)',
        boxShadow: '0 4px 20px rgba(255, 15, 154, 0.4)',
        bottom: '90px', 
        right: '24px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: 'grab'
      }}
      aria-label="SOS Panic Button"
    >
      <div className="relative z-10 flex flex-col items-center pointer-events-none select-none">
        <span className="font-extrabold text-white text-sm tracking-widest">SOS</span>
        <Bell className="text-white w-4 h-4 mt-0.5" /> 
      </div>
    </button>
  );
};

export default SOSButton;
