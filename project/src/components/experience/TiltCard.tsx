import { useEffect, useRef, type HTMLAttributes, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: number;
  depth?: number;
}

export function TiltCard({
  className,
  children,
  intensity = 7,
  depth = 24,
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const renderTilt = () => {
    frame.current = 0;
    const element = ref.current;
    if (!element) return;
    const { x, y } = point.current;
    element.style.setProperty('--tilt-x', `${((0.5 - y) * intensity * 2).toFixed(2)}deg`);
    element.style.setProperty('--tilt-y', `${((x - 0.5) * intensity * 2).toFixed(2)}deg`);
    element.style.setProperty('--glow-x', `${(x * 100).toFixed(1)}%`);
    element.style.setProperty('--glow-y', `${(y * 100).toFixed(1)}%`);
    element.style.setProperty('--tilt-depth', `${depth}px`);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const element = ref.current;
    if (!element || event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = element.getBoundingClientRect();
    point.current = {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    };
    if (!frame.current) frame.current = requestAnimationFrame(renderTilt);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    const element = ref.current;
    if (!element) return;
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
    element.style.setProperty('--glow-x', '50%');
    element.style.setProperty('--glow-y', '50%');
  };

  return (
    <div
      ref={ref}
      className={cn('tilt-card', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <div className="tilt-card-glow" aria-hidden="true" />
      <div className="tilt-card-content">{children}</div>
    </div>
  );
}
