"use client";

import { useEffect, useRef } from "react";

/** A persistent arcade layer: the page scroll controls YOU's paddle while the match runs behind the site. */
export default function ScrollPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let scroll = 0;
    let raf = 0;
    let last = performance.now();
    let ball = { x: 0, y: 0, vx: 155, vy: 105 };
    let cpuY = 0;
    let playerY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!ball.x) {
        ball.x = w / 2;
        ball.y = h / 2;
        cpuY = h / 2;
        playerY = h / 2;
      }
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? window.scrollY / max : 0;
    };

    const reset = (direction = 1) => {
      ball.x = w / 2;
      ball.y = h * (0.25 + Math.random() * 0.5);
      ball.vx = 155 * direction;
      ball.vy = (Math.random() > 0.5 ? 1 : -1) * (80 + Math.random() * 80);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.035);
      last = now;
      const paddleH = Math.max(72, Math.min(150, h * 0.16));
      const pad = 28;
      playerY += ((h - paddleH) * scroll + paddleH / 2 - playerY) * 0.12;
      cpuY += (ball.y - cpuY) * 0.045;

      if (!reduced) {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        if (ball.y < 20 || ball.y > h - 20) {
          ball.vy *= -1;
          ball.y = Math.max(20, Math.min(h - 20, ball.y));
        }
        if (ball.x < pad + 10 && ball.x > pad && Math.abs(ball.y - playerY) < paddleH / 2 + 8) {
          ball.vx = Math.abs(ball.vx) * 1.015;
          ball.vy += (ball.y - playerY) * 1.6;
        }
        if (ball.x > w - pad - 10 && ball.x < w - pad && Math.abs(ball.y - cpuY) < paddleH / 2 + 8) {
          ball.vx = -Math.abs(ball.vx) * 1.015;
          ball.vy += (ball.y - cpuY) * 1.3;
        }
        if (ball.x < -40) reset(1);
        if (ball.x > w + 40) reset(-1);
        ball.vx = Math.max(-280, Math.min(280, ball.vx));
        ball.vy = Math.max(-220, Math.min(220, ball.vy));
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#7b5cff";
      ctx.lineWidth = 1;
      const gap = 48;
      for (let x = (w / 2) % gap; x < w; x += gap) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gap) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.globalAlpha = 0.16;
      ctx.setLineDash([5, 14]);
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
      ctx.setLineDash([]);

      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#7b5cff";
      ctx.fillRect(pad, playerY - paddleH / 2, 5, paddleH);
      ctx.fillStyle = "#a8e83c";
      ctx.fillRect(w - pad - 5, cpuY - paddleH / 2, 5, paddleH);
      ctx.beginPath(); ctx.arc(ball.x, ball.y, 4, 0, Math.PI * 2); ctx.fillStyle = "#e8e9ee"; ctx.fill();
      ctx.restore();
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-70" />;
}
