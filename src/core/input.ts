import type { Phase } from './burst';

/**
 * Breath input.
 * - Mouse / trackpad: left-click = breathe in, right-click = breathe out,
 *   each toward the cursor. (Two-finger click on a Mac trackpad is a right-click.)
 * - Touch / pen: taps alternate in, out, in, ... toward the finger.
 * - Keyboard: Space alternates in and out, straight upward.
 */
export interface BreathInputHandlers {
  /** `target` is in client (screen) pixels, or null for "straight up". */
  onBreath: (phase: Phase, target: { x: number; y: number } | null) => void;
  /** Phase a tap or key press should produce next. */
  nextPhase: () => Phase;
}

export function attachBreathInput(el: HTMLElement, handlers: BreathInputHandlers): () => void {
  const onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse') {
      if (e.button === 0) handlers.onBreath('inhale', { x: e.clientX, y: e.clientY });
      else if (e.button === 2) handlers.onBreath('exhale', { x: e.clientX, y: e.clientY });
      return;
    }
    handlers.onBreath(handlers.nextPhase(), { x: e.clientX, y: e.clientY });
  };

  const onContextMenu = (e: Event): void => e.preventDefault();

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.code !== 'Space' || e.repeat) return;
    e.preventDefault();
    handlers.onBreath(handlers.nextPhase(), null);
  };

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('contextmenu', onContextMenu);
  window.addEventListener('keydown', onKeyDown);

  return () => {
    el.removeEventListener('pointerdown', onPointerDown);
    el.removeEventListener('contextmenu', onContextMenu);
    window.removeEventListener('keydown', onKeyDown);
  };
}
