import React, { useEffect } from "react";

export default function Confetti({ trigger }) {
  useEffect(() => {
    if (!trigger) return;
    const duration = 1200;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#f9d923", "#181818", "#fff"]
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f9d923", "#181818", "#fff"]
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [trigger]);
  return null;
}
