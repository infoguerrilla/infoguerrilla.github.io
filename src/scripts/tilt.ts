export interface TiltAngles {
  rotateX: number;
  rotateY: number;
}

export function calculateTiltAngles(
  mouseX: number,
  mouseY: number,
  width: number,
  height: number,
  maxAngle = 6
): TiltAngles {
  if (width <= 0 || height <= 0) {
    return { rotateX: 0, rotateY: 0 };
  }

  const rawNormX = (mouseX / width - 0.5) * 2;
  const rawNormY = (mouseY / height - 0.5) * 2;

  // Clamp between -1 and 1
  const normX = Math.max(-1, Math.min(1, rawNormX));
  const normY = Math.max(-1, Math.min(1, rawNormY));

  const rotateY = normX * maxAngle;
  const rotateX = -normY * maxAngle;

  return { rotateX, rotateY };
}

export function shouldDisableTilt(
  prefersReducedMotion: boolean,
  isCoarsePointer: boolean,
  hasHover: boolean
): boolean {
  return prefersReducedMotion || isCoarsePointer || !hasHover;
}

export function initTiltCards(): void {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;

  if (shouldDisableTilt(prefersReducedMotion, isCoarsePointer, hasHover)) {
    return;
  }

  const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');

  cards.forEach((card) => {
    // Avoid double attaching
    if (card.dataset.tiltInitialized === 'true') return;
    card.dataset.tiltInitialized = 'true';

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovered = false;
    let animationFrameId: number | null = null;

    const render = () => {
      const lerpFactor = 0.12;
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      card.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;

      // If returning to 0 and difference is tiny, stop loop
      if (!isHovered && Math.abs(currentX) < 0.05 && Math.abs(currentY) < 0.05) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const angles = calculateTiltAngles(mouseX, mouseY, rect.width, rect.height, 6);
      targetX = angles.rotateX;
      targetY = angles.rotateY;
      isHovered = true;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    });

    card.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      isHovered = false;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    });
  });
}
