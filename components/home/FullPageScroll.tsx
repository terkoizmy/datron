// components/FullPageScroll.tsx
import React, { useEffect, useState, useRef } from 'react';

interface FullPageScrollProps {
  children: React.ReactNode;
}

const FullPageScroll: React.FC<FullPageScrollProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY: number;

    const handleScroll = (delta: number) => {
      if (isAnimating) return;

      if (delta > 0 && activeSection < childrenArray.length - 1) {
        setActiveSection(prev => prev + 1);
        setIsAnimating(true);
      } else if (delta < 0 && activeSection > 0) {
        setActiveSection(prev => prev - 1);
        setIsAnimating(true);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating) return;

      const currentY = e.touches[0].clientY;
      const delta = startY - currentY;

      if (Math.abs(delta) > 100) {
        handleScroll(delta);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        handleScroll(1);
      } else if (e.key === 'ArrowUp') {
        handleScroll(-1);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection, childrenArray.length, isAnimating]);

  const handleDotClick = (index: number) => {
    if (isAnimating) return;
    setActiveSection(index);
    setIsAnimating(true);
  };

  return (
    <div ref={containerRef} className="h-screen overflow-hidden relative">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
            index === activeSection ? 'translate-y-0' : index < activeSection ? '-translate-y-full' : 'translate-y-full'
          }`}
          onTransitionEnd={() => setIsAnimating(false)}
        >
          {React.isValidElement(child) && React.cloneElement(child, { // @ts-ignore
            isActive: index === activeSection })}
        </div>
      ))}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {childrenArray.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === activeSection ? 'bg-white' : 'bg-gray-400'
            } transition-colors duration-300`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FullPageScroll;