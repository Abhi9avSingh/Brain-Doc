import { useEffect } from 'react';

export function ExperienceRuntime() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';

    let scrollFrame = 0;
    let pointerFrame = 0;
    let idleTimer = 0;
    let previousY = window.scrollY;
    let previousTime = performance.now();
    let smoothedVelocity = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const writeScrollState = () => {
      scrollFrame = 0;
      const now = performance.now();
      const y = Math.max(0, window.scrollY);
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const delta = y - previousY;
      const elapsed = Math.max(16, now - previousTime);
      const velocity = Math.max(-1, Math.min(1, delta / elapsed / 1.1));
      smoothedVelocity += (velocity - smoothedVelocity) * 0.22;

      root.style.setProperty('--app-scroll-y', `${y.toFixed(1)}px`);
      root.style.setProperty('--app-scroll-progress', `${Math.min(1, y / range).toFixed(5)}`);
      root.style.setProperty('--app-scroll-velocity', smoothedVelocity.toFixed(4));
      root.dataset.scrolled = y > 24 ? 'true' : 'false';
      if (Math.abs(delta) > 1) root.dataset.scrollDirection = delta > 0 ? 'down' : 'up';
      root.dataset.scrolling = 'true';
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        root.dataset.scrolling = 'false';
        root.style.setProperty('--app-scroll-velocity', '0');
      }, 140);
      previousY = y;
      previousTime = now;
    };

    const requestScrollState = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(writeScrollState);
    };

    const writePointerState = () => {
      pointerFrame = 0;
      root.style.setProperty('--app-pointer-x', `${pointerX.toFixed(1)}px`);
      root.style.setProperty('--app-pointer-y', `${pointerY.toFixed(1)}px`);
      root.style.setProperty('--app-pointer-xn', (pointerX / Math.max(1, window.innerWidth)).toFixed(4));
      root.style.setProperty('--app-pointer-yn', (pointerY / Math.max(1, window.innerHeight)).toFixed(4));
    };

    const handlePointer = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(writePointerState);
    };

    const handleVisibility = () => {
      root.dataset.pageVisible = document.hidden ? 'false' : 'true';
      if (!document.hidden) requestScrollState();
    };

    writeScrollState();
    writePointerState();
    window.addEventListener('scroll', requestScrollState, { passive: true });
    window.addEventListener('resize', requestScrollState, { passive: true });
    window.addEventListener('pointermove', handlePointer, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      window.clearTimeout(idleTimer);
      window.removeEventListener('scroll', requestScrollState);
      window.removeEventListener('resize', requestScrollState);
      window.removeEventListener('pointermove', handlePointer);
      document.removeEventListener('visibilitychange', handleVisibility);
      history.scrollRestoration = previousRestoration;
      delete root.dataset.scrolling;
      delete root.dataset.scrollDirection;
      delete root.dataset.pageVisible;
      delete root.dataset.scrolled;
    };
  }, []);

  return (
    <>
      <a className="skip-to-content" href="#main-content">Skip to content</a>
      <div className="global-scroll-rail" aria-hidden="true"><span /></div>
    </>
  );
}
