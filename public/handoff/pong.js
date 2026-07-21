(function () {
  if (customElements.get('katalos-pong')) return;
  class KatalosPong extends HTMLElement {
    connectedCallback() {
      const W = 104, H = 88;
      this.style.display = 'block';
      this.style.width = '100%';
      this.style.height = '100%';
      this.style.position = 'relative';
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      cv.style.width = '100%';
      cv.style.height = '100%';
      cv.style.display = 'block';
      cv.style.imageRendering = 'pixelated';
      cv.style.touchAction = 'none';
      cv.style.cursor = 'none';
      cv.tabIndex = 0;
      cv.setAttribute('role', 'application');
      cv.setAttribute('aria-label', 'Playable pong. Move your paddle with the mouse or arrow keys.');
      this.appendChild(cv);
      const ctx = cv.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      const PH = 22, PW = 4, BALL = 5;
      const st = {
        py: H / 2 - PH / 2, ay: H / 2 - PH / 2,
        bx: W / 2, by: H / 2, vx: 0, vy: 0,
        ps: 0, as: 0, target: null, up: false, down: false,
        rally: 0, hint: 200
      };
      const serve = (dir) => {
        st.bx = W / 2; st.by = H / 2;
        const ang = (Math.random() * 0.8 - 0.4);
        st.vx = dir * 1.15 * Math.cos(ang);
        st.vy = 1.15 * Math.sin(ang) + (Math.random() - 0.5);
        st.rally = 0;
      };
      serve(Math.random() < 0.5 ? -1 : 1);

      const rectToPaddleY = (clientY) => {
        const r = cv.getBoundingClientRect();
        const y = (clientY - r.top) / r.height * H;
        return Math.max(0, Math.min(H - PH, y - PH / 2));
      };
      this._onMove = (e) => { st.target = rectToPaddleY(e.clientY); st.hint = 0; };
      this._onDown = (e) => { st.target = rectToPaddleY(e.clientY); cv.focus(); st.hint = 0; e.preventDefault(); };
      this._onKey = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w') { st.up = true; st.target = null; st.hint = 0; e.preventDefault(); }
        if (e.key === 'ArrowDown' || e.key === 's') { st.down = true; st.target = null; st.hint = 0; e.preventDefault(); }
      };
      this._onKeyUp = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w') st.up = false;
        if (e.key === 'ArrowDown' || e.key === 's') st.down = false;
      };
      cv.addEventListener('pointermove', this._onMove);
      cv.addEventListener('pointerdown', this._onDown);
      cv.addEventListener('keydown', this._onKey);
      cv.addEventListener('keyup', this._onKeyUp);

      const FG = '#7fe36b', DIM = '#2f7a3c', BG = '#071108';
      const step = () => {
        // player
        if (st.target != null) st.py += (st.target - st.py) * 0.35;
        if (st.up) st.py -= 2.4;
        if (st.down) st.py += 2.4;
        st.py = Math.max(0, Math.min(H - PH, st.py));
        // ai (beatable): eases toward ball, slower, with deadzone
        const aiC = st.ay + PH / 2, err = st.by - aiC;
        if (Math.abs(err) > 6) st.ay += Math.sign(err) * Math.min(1.5, Math.abs(err) * 0.12);
        st.ay = Math.max(0, Math.min(H - PH, st.ay));
        // ball
        st.bx += st.vx; st.by += st.vy;
        if (st.by <= 0) { st.by = 0; st.vy = Math.abs(st.vy); }
        if (st.by >= H - BALL) { st.by = H - BALL; st.vy = -Math.abs(st.vy); }
        // player paddle collision
        if (st.vx < 0 && st.bx <= PW + 4 && st.bx >= 2 && st.by + BALL >= st.py && st.by <= st.py + PH) {
          st.bx = PW + 4; st.vx = Math.abs(st.vx);
          const rel = (st.by + BALL / 2 - (st.py + PH / 2)) / (PH / 2);
          st.vy = rel * 1.6; st.rally++;
          const sp = Math.min(2.4, 1.15 + st.rally * 0.08); const m = sp / Math.hypot(st.vx, st.vy || 0.001);
          st.vx *= m; st.vy *= m;
        }
        // ai paddle collision
        if (st.vx > 0 && st.bx + BALL >= W - PW - 4 && st.bx + BALL <= W - 2 && st.by + BALL >= st.ay && st.by <= st.ay + PH) {
          st.bx = W - PW - 4 - BALL; st.vx = -Math.abs(st.vx);
          const rel = (st.by + BALL / 2 - (st.ay + PH / 2)) / (PH / 2);
          st.vy = rel * 1.6; st.rally++;
          const sp = Math.min(2.4, 1.15 + st.rally * 0.08); const m = sp / Math.hypot(st.vx, st.vy || 0.001);
          st.vx *= m; st.vy *= m;
        }
        // score
        if (st.bx < -2) { st.as++; serve(1); }
        if (st.bx > W + 2) { st.ps++; serve(-1); }
        if (st.hint > 0) st.hint--;
        // draw
        ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = DIM;
        for (let y = 2; y < H; y += 8) ctx.fillRect(W / 2 - 1, y, 2, 4);
        ctx.fillStyle = FG;
        ctx.fillRect(2, Math.round(st.py), PW, PH);
        ctx.fillRect(W - PW - 2, Math.round(st.ay), PW, PH);
        ctx.fillRect(Math.round(st.bx), Math.round(st.by), BALL, BALL);
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = FG;
        ctx.textBaseline = 'top';
        ctx.fillText(String(st.ps), W / 2 - 16, 3);
        ctx.fillText(String(st.as), W / 2 + 10, 3);
        if (st.hint > 0 && (Math.floor(st.hint / 12) % 2 === 0)) {
          ctx.font = '6px "Press Start 2P", monospace';
          ctx.fillStyle = FG;
          ctx.textAlign = 'center';
          ctx.fillText('MOVE TO PLAY', W / 2, H - 12);
          ctx.textAlign = 'left';
        }
        // scanlines
        ctx.fillStyle = 'rgba(0,0,0,.16)';
        for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
        this._raf = requestAnimationFrame(step);
      };
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) { step(); cancelAnimationFrame(this._raf); }
      else this._raf = requestAnimationFrame(step);
    }
    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
    }
  }
  customElements.define('katalos-pong', KatalosPong);
})();
