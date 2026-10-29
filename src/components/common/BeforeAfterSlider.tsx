import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before: Original State',
  afterLabel = 'After: Aura & Oak Execution'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const startDragging = () => {
    isDragging.current = true;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="before-after-wrapper"
      onMouseDown={startDragging}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onMouseMove={handleMouseMove}
      onTouchStart={startDragging}
      onTouchEnd={stopDragging}
      onTouchMove={handleTouchMove}
    >
      {/* After image (background layer) */}
      <img
        src={afterImage}
        alt="Transformed interior after design execution"
        className="before-after-img"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="before-after-badge right">{afterLabel}</div>

      {/* Before image (clipped foreground layer) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${sliderPosition}%`,
          overflow: 'hidden'
        }}
      >
        <img
          src={beforeImage}
          alt="Original interior before design renovation"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            height: '100%',
            maxWidth: 'none',
            objectFit: 'cover'
          }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="before-after-badge left">{beforeLabel}</div>
      </div>

      {/* Draggable Divider Line & Knob */}
      <div
        className="before-after-slider-line"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="before-after-handle" aria-label="Drag slider to compare before and after">
          <ChevronsLeftRight size={18} />
        </div>
      </div>
    </div>
  );
};
