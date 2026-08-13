import { useEffect, useRef } from 'react';
import { Brain, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeuralSceneProps {
  compact?: boolean;
  className?: string;
  showLabels?: boolean;
}

type Point3D = { x: number; y: number; z: number; phase: number };
type ProjectedPoint = Point3D & { sx: number; sy: number; depth: number; scale: number };

function createSpherePoints(count: number): Point3D[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  return Array.from({ length: count }, (_, index) => {
    const y = 1 - ((index + 0.5) / count) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = goldenAngle * index;

    return {
      x: Math.cos(angle) * radius,
      y,
      z: Math.sin(angle) * radius,
      phase: (index % 17) / 17,
    };
  });
}

export function NeuralScene({ compact = false, className, showLabels = true }: NeuralSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const points = createSpherePoints(compact ? 86 : 132);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const project = (point: Point3D, rotationX: number, rotationY: number): ProjectedPoint => {
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const x1 = point.x * cosY - point.z * sinY;
      const z1 = point.x * sinY + point.z * cosY;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const y2 = point.y * cosX - z1 * sinX;
      const z2 = point.y * sinX + z1 * cosX;

      const radius = Math.min(width, height) * (compact ? 0.32 : 0.34);
      const perspective = 1 / (1.18 - z2 * 0.3);

      return {
        ...point,
        sx: width / 2 + x1 * radius * perspective,
        sy: height / 2 + y2 * radius * perspective,
        depth: z2,
        scale: perspective,
      };
    };

    const draw = () => {
      if (!visible) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;

      if (!reducedMotion) frame += 1;
      const rotationY = frame * (compact ? 0.0035 : 0.0027) + pointer.x * 0.46;
      const rotationX = -0.16 + Math.sin(frame * 0.0018) * 0.08 - pointer.y * 0.32;
      const projected = points.map((point) => project(point, rotationX, rotationY));

      context.clearRect(0, 0, width, height);

      const halo = context.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.47,
      );
      halo.addColorStop(0, 'rgba(151, 255, 112, 0.12)');
      halo.addColorStop(0.42, 'rgba(87, 133, 255, 0.07)');
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < projected.length; i += 1) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j += 1) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < (compact ? 0.42 : 0.36)) {
            const visibility = Math.max(0.04, ((a.depth + b.depth) / 2 + 1) / 2);
            const opacity = (1 - distance / 0.42) * visibility * 0.38;
            context.beginPath();
            context.moveTo(a.sx, a.sy);
            context.lineTo(b.sx, b.sy);
            context.strokeStyle = `rgba(164, 220, 255, ${opacity})`;
            context.lineWidth = 0.65;
            context.stroke();
          }
        }
      }

      projected
        .sort((a, b) => a.depth - b.depth)
        .forEach((point, index) => {
          const front = (point.depth + 1) / 2;
          const pulse = 0.75 + Math.sin(frame * 0.025 + point.phase * Math.PI * 2) * 0.25;
          const size = (compact ? 1.4 : 1.75) * point.scale * (0.75 + front * 0.7);
          const highlight = index % 11 === 0;

          context.beginPath();
          context.arc(point.sx, point.sy, highlight ? size * 1.8 : size, 0, Math.PI * 2);
          context.fillStyle = highlight
            ? `rgba(190, 255, 107, ${0.45 + front * 0.5 * pulse})`
            : `rgba(190, 224, 255, ${0.22 + front * 0.72})`;
          context.fill();

          if (highlight) {
            context.beginPath();
            context.arc(point.sx, point.sy, size * 4.5, 0, Math.PI * 2);
            context.fillStyle = `rgba(168, 255, 92, ${0.035 + front * 0.05})`;
            context.fill();
          }
        });

      const coreRadius = Math.min(width, height) * (compact ? 0.045 : 0.052);
      const core = context.createRadialGradient(
        width / 2 - coreRadius * 0.35,
        height / 2 - coreRadius * 0.35,
        0,
        width / 2,
        height / 2,
        coreRadius * 2.8,
      );
      core.addColorStop(0, 'rgba(255,255,255,.98)');
      core.addColorStop(0.22, 'rgba(188,255,104,.9)');
      core.addColorStop(0.58, 'rgba(95,157,255,.25)');
      core.addColorStop(1, 'rgba(95,157,255,0)');
      context.fillStyle = core;
      context.beginPath();
      context.arc(width / 2, height / 2, coreRadius * 2.8, 0, Math.PI * 2);
      context.fill();

      animationFrame = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerRef.current.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handlePointerLeave = () => {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [compact]);

  return (
    <div
      className={cn('neural-scene', compact && 'neural-scene-compact', className)}
      role="img"
      aria-label="Interactive three-dimensional map of connected knowledge"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="neural-core-mark" aria-hidden="true">
        <Brain />
      </div>
      {showLabels && !compact && (
        <>
          <div className="neural-chip neural-chip-a">
            <FileText />
            <span><strong>128</strong> sources</span>
          </div>
          <div className="neural-chip neural-chip-b">
            <Search />
            <span><strong>97%</strong> match</span>
          </div>
          <div className="neural-chip neural-chip-c">
            <span className="neural-live-dot" />
            <span>Memory online</span>
          </div>
        </>
      )}
    </div>
  );
}
