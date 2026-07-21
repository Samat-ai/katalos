'use client';

import { useEffect, useRef } from 'react';

export function PongChannel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const width = 104; const height = 88; const paddleHeight = 22; const paddleWidth = 4; const ballSize = 5;
    const state = { playerY: 33, aiY: 33, ballX: 52, ballY: 44, velocityX: 1.1, velocityY: .4, playerScore: 0, aiScore: 0, targetY: null as number | null, up: false, down: false, rally: 0 };
    const serve = (direction: number) => { state.ballX = width / 2; state.ballY = height / 2; state.velocityX = direction * 1.15; state.velocityY = Math.random() * 1.4 - .7; state.rally = 0; };
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const setPointerTarget = (clientY: number) => { const bounds = canvas.getBoundingClientRect(); state.targetY = clamp(((clientY - bounds.top) / bounds.height) * height - paddleHeight / 2, 0, height - paddleHeight); };
    const pointerMove = (event: PointerEvent) => setPointerTarget(event.clientY);
    const pointerDown = (event: PointerEvent) => { setPointerTarget(event.clientY); canvas.focus(); event.preventDefault(); };
    const keyDown = (event: KeyboardEvent) => { if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') { state.up = true; state.targetY = null; event.preventDefault(); } if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') { state.down = true; state.targetY = null; event.preventDefault(); } };
    const keyUp = (event: KeyboardEvent) => { if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') state.up = false; if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') state.down = false; };
    canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('keydown', keyDown); canvas.addEventListener('keyup', keyUp);
    let frame = 0;
    const tick = () => {
      if (state.targetY !== null) state.playerY += (state.targetY - state.playerY) * .35;
      if (state.up) state.playerY -= 2.4; if (state.down) state.playerY += 2.4;
      state.playerY = clamp(state.playerY, 0, height - paddleHeight);
      const aiDelta = state.ballY - (state.aiY + paddleHeight / 2); if (Math.abs(aiDelta) > 6) state.aiY += Math.sign(aiDelta) * Math.min(1.5, Math.abs(aiDelta) * .12);
      state.aiY = clamp(state.aiY, 0, height - paddleHeight); state.ballX += state.velocityX; state.ballY += state.velocityY;
      if (state.ballY <= 0 || state.ballY >= height - ballSize) { state.ballY = clamp(state.ballY, 0, height - ballSize); state.velocityY *= -1; }
      const hitPlayer = state.velocityX < 0 && state.ballX <= 8 && state.ballX >= 2 && state.ballY + ballSize >= state.playerY && state.ballY <= state.playerY + paddleHeight;
      const hitAi = state.velocityX > 0 && state.ballX + ballSize >= width - 8 && state.ballX + ballSize <= width - 2 && state.ballY + ballSize >= state.aiY && state.ballY <= state.aiY + paddleHeight;
      if (hitPlayer || hitAi) { state.velocityX = Math.abs(state.velocityX) * (hitPlayer ? 1 : -1); state.velocityY = (((state.ballY + ballSize / 2) - ((hitPlayer ? state.playerY : state.aiY) + paddleHeight / 2)) / (paddleHeight / 2)) * 1.6; state.rally++; const speed = Math.min(2.4, 1.15 + state.rally * .08); const magnitude = Math.hypot(state.velocityX, state.velocityY || .01); state.velocityX = state.velocityX / magnitude * speed; state.velocityY = state.velocityY / magnitude * speed; }
      if (state.ballX < -2) { state.aiScore++; serve(1); } if (state.ballX > width + 2) { state.playerScore++; serve(-1); }
      context.fillStyle = '#071108'; context.fillRect(0, 0, width, height); context.fillStyle = '#2f7a3c'; for (let y = 2; y < height; y += 8) context.fillRect(width / 2 - 1, y, 2, 4); context.fillStyle = '#7fe36b'; context.fillRect(2, Math.round(state.playerY), paddleWidth, paddleHeight); context.fillRect(width - paddleWidth - 2, Math.round(state.aiY), paddleWidth, paddleHeight); context.fillRect(Math.round(state.ballX), Math.round(state.ballY), ballSize, ballSize); context.font = '9px monospace'; context.fillText(String(state.playerScore), 36, 9); context.fillText(String(state.aiScore), 60, 9); context.fillStyle = 'rgba(0,0,0,.16)'; for (let y = 0; y < height; y += 4) context.fillRect(0, y, width, 2);
      frame = requestAnimationFrame(tick);
    };
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (!reducedMotion) frame = requestAnimationFrame(tick); else tick();
    return () => { cancelAnimationFrame(frame); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('keydown', keyDown); canvas.removeEventListener('keyup', keyUp); };
  }, []);

  return <canvas ref={canvasRef} className="pong-channel" width="104" height="88" tabIndex={0} role="application" aria-label="Playable Pong. Move your paddle with the mouse or arrow keys." />;
}
