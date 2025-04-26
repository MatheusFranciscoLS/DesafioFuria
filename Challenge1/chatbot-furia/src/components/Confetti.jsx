import React, { useEffect, useRef } from 'react';

export default function Confetti({ run }) {
  const ref = useRef();

  useEffect(() => {
    if (!run) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 320;
    const H = canvas.height = 120;
    const confs = Array.from({ length: 32 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H / 2,
      r: 5 + Math.random() * 8,
      d: 2 + Math.random() * 3,
      color: `hsl(${Math.random() * 50 + 40},90%,60%)`
    }));
    let frame;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      confs.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.fill();
        c.y += c.d;
        if (c.y > H) c.y = -10;
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, [run]);

  return (
    <canvas ref={ref} width={320} height={120} style={{ display: run ? 'block' : 'none', margin: '0 auto', background: 'none', pointerEvents: 'none' }} aria-hidden />
  );
}
