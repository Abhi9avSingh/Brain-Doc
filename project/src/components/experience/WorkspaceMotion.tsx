import { useEffect } from 'react';

export function WorkspaceMotion() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let active: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const render = () => {
      frame = 0;
      if (!active) return;
      const rect = active.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (pointerY - rect.top) / rect.height));
      active.style.setProperty('--workspace-rx', `${((0.5 - y) * 5).toFixed(2)}deg`);
      active.style.setProperty('--workspace-ry', `${((x - 0.5) * 6).toFixed(2)}deg`);
      active.style.setProperty('--workspace-mx', `${(x * 100).toFixed(1)}%`);
      active.style.setProperty('--workspace-my', `${(y * 100).toFixed(1)}%`);
    };

    const handleMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('.workspace-tilt, .app-3d-shell .card');
      if (target !== active) {
        active?.classList.remove('is-pointer-active');
        active?.style.setProperty('--workspace-rx', '0deg');
        active?.style.setProperty('--workspace-ry', '0deg');
        active = target;
        active?.classList.add('is-pointer-active');
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    };

    const handleLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      active?.classList.remove('is-pointer-active');
      active?.style.setProperty('--workspace-rx', '0deg');
      active?.style.setProperty('--workspace-ry', '0deg');
      active = null;
    };

    const handleScroll = () => {
      document.documentElement.style.setProperty('--workspace-scroll', `${window.scrollY}px`);
    };

    document.addEventListener('pointermove', handleMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
