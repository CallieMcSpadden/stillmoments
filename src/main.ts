import './styles.css';

/**
 * Entry point. Shows the intro, waits for the first tap (required on iOS before any
 * audio can play), then hands off to the session.
 *
 * Checkpoint 2 replaces startSession() with breathClock + input + the grey-box world.
 */

const intro = document.getElementById('intro');
const begin = document.getElementById('begin');

function startSession(): void {
  intro?.classList.add('is-leaving');
  // Checkpoint 2: create the AudioContext here (inside the user gesture),
  // start breathClock, mount the world canvas, and attach input.
}

begin?.addEventListener('click', startSession, { once: true });

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && intro && !intro.classList.contains('is-leaving')) {
    event.preventDefault();
    startSession();
  }
});
