import './styles.css';
import { startSession } from './session';

/**
 * Entry point. Shows the intro and waits for the first tap (iOS requires a tap
 * before any audio can play; the AudioContext will be created here at checkpoint 3),
 * then starts the breathing session.
 */

const intro = document.getElementById('intro') as HTMLElement;
const begin = document.getElementById('begin') as HTMLButtonElement;
const placeholder = document.querySelector('.stage') as HTMLElement | null;
const canvas = document.getElementById('world') as HTMLCanvasElement;
const hint = document.getElementById('session-hint') as HTMLElement;
const ending = document.getElementById('ending') as HTMLElement;
const returnBtn = document.getElementById('return') as HTMLButtonElement;

let started = false;

function start(): void {
  if (started) return;
  started = true;
  intro.classList.add('is-leaving');
  placeholder?.classList.add('is-leaving');
  canvas.hidden = false;
  requestAnimationFrame(() => canvas.classList.add('is-visible'));
  startSession({ canvas, hint, ending });
}

begin.addEventListener('click', start);
window.addEventListener('keydown', (event) => {
  if (!started && (event.code === 'Space' || event.code === 'Enter')) {
    event.preventDefault();
    start();
  }
});

returnBtn.addEventListener('click', () => window.location.reload());
