import confetti from 'canvas-confetti';

export function triggerMilestoneCelebration() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#38bdf8', '#fbbf24'],
  });
}
