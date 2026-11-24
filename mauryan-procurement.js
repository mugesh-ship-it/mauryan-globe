/* Mauryan: How Procurement Works (scroll scenes) */
(function(){
const CSS=`
[data-process="stage"] .process_frame{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:-1}
[data-process="stage"] .process_frame i{position:absolute;left:0;top:0;transform:translate(-50%,-50%);width:580px;height:var(--ph,100vh);background:repeating-linear-gradient(#d5dae2 0 4px,transparent 4px 9px) left/1px 100% no-repeat,repeating-linear-gradient(#d5dae2 0 4px,transparent 4px 9px) right/1px 100% no-repeat}
[data-process="stage"] .process_frame b{position:absolute;left:0;top:0;transform:translate(-50%,-50%);width:790px;height:540px;background:repeating-linear-gradient(90deg,#d5dae2 0 4px,transparent 4px 9px) top/100% 1px no-repeat,repeating-linear-gradient(90deg,#d5dae2 0 4px,transparent 4px 9px) bottom/100% 1px no-repeat}
[data-proc-scene]{--blue:#0c51ee;--ink:#111827;--muted:#6b7686;--line:#e9edf3;width:100%;min-width:0;font-family:inherit;color:#151515}
[data-proc-scene] svg.fig{width:100%;height:auto;display:block;overflow:visible;margin:auto 0}
[data-proc-scene] .f{stroke:#b9c2d0;stroke-width:1;stroke-linejoin:round}
[data-proc-scene] .lf{fill:#f1f4f8}[data-proc-scene] .rt{fill:#e4e9f0}[data-proc-scene] .tp{fill:#fff}[data-proc-scene] .dp{fill:#dde3ec}
[data-proc-scene="requirement"] .f,[data-proc-scene="requirement"] svg.fig [stroke-width="1"]{stroke-width:.75}
[data-proc-scene="requirement"] svg.fig [stroke-width="2.6"],[data-proc-scene="requirement"] svg.fig [stroke-width="2.4"],[data-proc-scene="requirement"] svg.fig [stroke-width="1.8"]{stroke-width:1.25}
[data-proc-scene="requirement"] svg.fig [stroke-width="1.6"]{stroke-width:1}
[data-proc-scene] .list{list-style:none;margin:4px 0 0;padding:0}
[data-proc-scene] .list li{display:flex;align-items:center;gap:12px;padding:13px 2px;border-top:1px solid var(--line);font-size:17px;color:var(--muted);transition:color .3s}
[data-proc-scene] .list li.on{color:var(--ink)}
[data-proc-scene] .tk{width:22px;height:22px;flex:none}
[data-proc-scene] .tk circle{fill:#fff;stroke:#cfd6e2;stroke-width:1.6;transition:stroke .3s,fill .3s}
[data-proc-scene] .tk path{fill:none;stroke:var(--blue);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .35s ease .05s}
[data-proc-scene] li.on .tk circle{stroke:var(--blue);fill:#f4f7ff}
[data-proc-scene] li.on .tk path{stroke-dashoffset:0}
[data-proc-scene] .pill{display:inline-flex;align-items:center;gap:9px;margin-top:16px;padding:9px 16px;border:1px solid #e3e8f0;border-radius:999px;font-size:14px;font-weight:500;color:#97a1b3;background:#fff;white-space:nowrap;transition:all .3s}
[data-proc-scene] .pill i{width:8px;height:8px;border-radius:50%;background:#cfd6e2;transition:background .3s}
[data-proc-scene] .pill.on{color:var(--blue);border-color:#dbe3f5;background:#f7f9ff}
[data-proc-scene] .pill.on i{background:var(--blue)}
[data-proc-scene="requirement"] .pill,[data-proc-scene="requirement"] .pill.on{gap:8px;padding:9px 15px;font-size:13px;font-weight:400;line-height:17px;white-space:nowrap}[data-proc-scene="requirement"] .pill,[data-proc-scene="requirement"] .pill.on{border-color:#dbe3f5;background:#f7f9ff;color:var(--blue)}
[data-proc-scene="requirement"] .pill i,[data-proc-scene="requirement"] .pill.on i{width:6px;height:6px}[data-proc-scene="requirement"] .pill i,[data-proc-scene="requirement"] .pill.on i{background:var(--blue)}
[data-proc-scene] .ic{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
[data-proc-scene="requirement"] .ic{width:18px;height:18px;stroke-width:1.45}
[data-proc-scene] .tl{font-size:14px;font-weight:500;line-height:1.25}
[data-proc-scene] .link{margin-top:8px}
[data-proc-scene] .ends{display:flex;align-items:center;gap:12px}
[data-proc-scene] .node{width:46px;height:46px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:#97a1b3;background:#fff;flex:none;transition:all .35s}
[data-proc-scene] .node img,[data-proc-scene] .node .ic{width:22px;height:22px}
[data-proc-scene] .wire{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;gap:7px}
[data-proc-scene] .wire b{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:500;color:#b3bccb;transition:color .3s}
[data-proc-scene] .wire s{display:block;width:100%;height:3px;border-radius:3px;background:repeating-linear-gradient(90deg,#d5dbe6 0 6px,transparent 6px 11px);position:relative;overflow:hidden;text-decoration:none}
[data-proc-scene] .wire u,[data-proc-scene] .seg u{position:absolute;inset:0;background:var(--blue);transform-origin:left;text-decoration:none}
[data-proc-scene] .wire u{transform:scaleX(var(--k,0))}
[data-proc-scene] .track{display:flex;align-items:flex-start;margin-top:10px}
[data-proc-scene] .stop{display:flex;flex-direction:column;align-items:center;gap:9px;width:84px;flex:none;color:#97a1b3;text-align:center;transition:color .35s}
[data-proc-scene] .stop .ib{width:46px;height:46px;border-radius:50%;border:1px solid var(--line);background:#fff;display:grid;place-items:center;transition:all .35s}
[data-proc-scene] .stop .ib .ic{width:22px;height:22px}
[data-proc-scene] .stop.on{color:var(--ink)}
[data-proc-scene] .stop.on .ib{color:var(--blue);border-color:#bcd0fb;background:#eef3ff}
[data-proc-scene] .seg{display:block;flex:1;height:3px;margin-top:22px;border-radius:3px;background:#e3e8f0;position:relative;overflow:hidden;text-decoration:none}
[data-proc-scene] .seg:nth-of-type(1) u{transform:scaleX(var(--a1,0))}
[data-proc-scene] .seg:nth-of-type(2) u{transform:scaleX(var(--a2,0))}
[data-proc-scene] .foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:16px}
[data-proc-scene] .foot .pill{margin-top:0}
[data-proc-scene] .icons{display:flex;gap:10px}
[data-proc-scene] .icons .ib{width:40px;height:40px;border-radius:8px;border:1px solid #d9e1f6;display:grid;place-items:center;color:#b3bccb;background:#f5f7fd;transition:all .35s}
[data-proc-scene] .icons .ib.on{color:var(--blue)}
[data-proc-scene] .link+.pill{margin-top:18px}
@media(max-width:420px){[data-proc-scene] .list li{font-size:16px}}
@media(min-width:768px){
[data-process="stage"] .process_frame b{height:calc(var(--ph,100vh) - 280px)}
[data-proc-scene]{transform:translateY(var(--optical-offset,0px))}
[data-proc-scene="source"] .node,[data-proc-scene="delivery"] .stop .ib,[data-proc-scene="delivery"] .stop.on .ib{width:40px;height:40px;border-radius:8px;border:1px solid #d9e1f6;background:#f5f7fd}
.figma-process-icon{display:block;max-width:none;flex:none}
[data-proc-scene="source"] .ends{gap:18px}
[data-proc-scene="source"] .wire{gap:10px}
[data-proc-scene="source"] .wire b{font-size:14px;line-height:1.4;font-weight:400;letter-spacing:0;text-transform:none;color:#111827}
[data-proc-scene="source"] .wire s{height:1px}
[data-proc-scene="source"] .link{margin-top:15px}
[data-proc-scene="source"]>.pill{display:flex;width:156px;height:40px;box-sizing:border-box;justify-content:center;margin:18px auto 0;padding:0;gap:9px}
[data-proc-scene="inspection"] .list{margin-top:8px}
[data-proc-scene="inspection"] .list li{height:48px;box-sizing:border-box;padding:13px 2px;gap:12px;font-size:14px;font-weight:400;line-height:1.4}
[data-proc-scene="inspection"]>.pill{margin-top:18px}
[data-proc-scene="delivery"] .track{margin-top:20px}
[data-proc-scene="delivery"] .stop{gap:17px;color:#111827}
[data-proc-scene="delivery"] .tl{font-size:14px;font-weight:400;line-height:1.4}
[data-proc-scene="delivery"] .seg{height:1px;margin-top:20px}
[data-proc-scene="source"]>.pill,[data-proc-scene="inspection"]>.pill{font-size:14px;font-weight:400;line-height:1.2}
}
.process_circle,.process_circle.is-active{border-color:transparent!important}[data-process-track]{stroke:#d5dae2;stroke-dasharray:2.86 2.86;transition:stroke .3s}
@media(max-width:991px){[data-process="stage"] .process_frame i{width:calc(100vw - 40px)}[data-process="stage"] .process_frame b{width:100vw;height:calc(var(--ph,100vh) - 24px)}}
@media(max-width:767px){[data-process="stage"] .process_frame i{width:calc(100vw - 50px);height:calc(var(--ph,100vh)*.74)}[data-process="stage"] .process_frame b{height:calc(var(--ph,100vh)*.74)}[data-process-track]{stroke-dasharray:none}[data-proc-scene="requirement"] .foot{flex-wrap:nowrap;gap:8px}[data-proc-scene="requirement"] .icons{gap:8px}[data-proc-scene="requirement"] .icons .ib{width:34px;height:34px;border-radius:7px}[data-proc-scene="requirement"] .pill,[data-proc-scene="requirement"] .pill.on{padding:7px 12px;font-size:12px;gap:7px}}
`;
function init(){
/* Shared engine for the four process cards: isometric primitives, the carton, and the card itself. */
const NS = "http://www.w3.org/2000/svg";
const el = (t, a = {}, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const raw = (p, a, b) => clamp((p - a) / (b - a));
const seg = (p, a, b) => ease(raw(p, a, b));
const backOut = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
const COL = {
  line: "#b9c2d0", top: "#ffffff", lf: "#f1f4f8", rt: "#e4e9f0", deep: "#dde3ec", tape: "#e3e8f0",
  blue: "#2f5de8", ink: "#97a1b3", faint: "#cfd6e2", floor: "#f4f6fa",
};
const f1 = (n) => Math.round(n * 10) / 10;
const pd = (pts) => "M" + pts.map((q) => f1(q[0]) + " " + f1(q[1])).join("L") + "Z";
const pl = (pts) => "M" + pts.map((q) => f1(q[0]) + " " + f1(q[1])).join("L");
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))).toString(16).padStart(2, "0")).join("");
};

function hull(pts) {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

/** A rounded rectangle as a ring of ground points. */
function rr(x0, y0, x1, y1, r, n = 6) {
  r = Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2);
  const out = [], C = [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180], [x1 - r, y0 + r, 270]];
  for (const [cx, cy, a0] of C) for (let i = 0; i <= n; i++) {
    const a = ((a0 + (90 * i) / n) * Math.PI) / 180;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

/** Isometric projection: +x runs right and down, +y runs left and down, z is up. */
function iso() {
  const I = { S: 1, ox: 0, oy: 0 };
  I.P = (x, y, z) => [I.ox + I.S * (x - y) * 0.866, I.oy + I.S * ((x + y) * 0.5 - z)];
  I.fit = (pts, W, H, pad) => {
    const r = pts.map(([x, y, z]) => [(x - y) * 0.866, (x + y) * 0.5 - z]);
    const xs = r.map((q) => q[0]), ys = r.map((q) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    I.S = Math.min((W - 2 * pad) / (x1 - x0), (H - 2 * pad) / (y1 - y0));
    I.ox = W / 2 - (I.S * (x0 + x1)) / 2;
    I.oy = H / 2 - (I.S * (y0 + y1)) / 2;
    return I;
  };
  return I;
}

const cls = { lf: "f lf", rt: "f rt", tp: "f tp", dp: "f dp" };
class Box {
  constructor(parent, o = {}) {
    this.g = el("g", {}, parent);
    this.l = el("path", { class: cls.lf }, this.g);
    this.r = el("path", { class: cls.rt }, this.g);
    this.t = el("path", { class: cls.tp }, this.g);
    if (o.lf) this.l.setAttribute("fill", o.lf);
    if (o.rt) this.r.setAttribute("fill", o.rt);
    if (o.tp) this.t.setAttribute("fill", o.tp);
  }
  set(P, x0, y0, z0, x1, y1, z1) {
    this.l.setAttribute("d", pd([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)]));
    this.r.setAttribute("d", pd([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)]));
    this.t.setAttribute("d", pd([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)]));
    return this;
  }
}
const box = (parent, P, x0, y0, z0, x1, y1, z1, o) => new Box(parent, o).set(P, x0, y0, z0, x1, y1, z1);

/** A flat polygon given in 3D. */
const quad = (parent, P, pts, fill, stroke = COL.line, w = 1) =>
  el("path", { d: pd(pts.map((q) => P(...q))), fill, stroke, "stroke-width": w, "stroke-linejoin": "round" }, parent);

/** A soft rounded solid: smooth shading around the corners. */
function rrSolid(parent, P, x0, y0, x1, y1, z0, z1, r, o = {}) {
  const g = el("g", {}, parent), ring = rr(x0, y0, x1, y1, r, 6), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, n = ring.length;
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n];
    let nx = b[1] - a[1], ny = -(b[0] - a[0]);
    const mx = (a[0] + b[0]) / 2 - cx, my = (a[1] + b[1]) / 2 - cy;
    if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny; }
    const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
    if (nx + ny <= 0.001) continue;
    const c = mix(COL.lf, COL.rt, (nx - ny + 1) / 2);
    el("path", { d: pd([P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1)]), fill: c, stroke: c, "stroke-width": 0.8, "stroke-linejoin": "round" }, g);
  }
  const top = ring.map((q) => P(q[0], q[1], z1)), bot = ring.map((q) => P(q[0], q[1], z0));
  el("path", { d: pd(hull([...top, ...bot])), fill: "none", stroke: COL.line, "stroke-width": 1, "stroke-linejoin": "round" }, g);
  el("path", { d: pd(top), fill: o.top || COL.top, stroke: COL.line, "stroke-width": 1, "stroke-linejoin": "round" }, g);
  return g;
}

/** Keeps moving parts in painter's order. */
class Stack {
  constructor(parent) { this.parent = parent; this.items = []; this.order = []; }
  add(g, key = 0) { const it = { g, key }; this.items.push(it); this.parent.appendChild(g); return it; }
  sort() {
    const s = [...this.items].sort((a, b) => a.key - b.key);
    if (s.some((it, i) => it !== this.order[i])) s.forEach((it) => this.parent.appendChild(it.g));
    this.order = s;
  }
}

/** The shipping carton. phi is the flap angle: 0 closed and taped, 118 fully open. */
class Carton {
  constructor(parent, w = 36, d = 36, h = 34) {
    Object.assign(this, { w, d, h });
    this.g = el("g", {}, parent);
    this.id = "cl" + (Carton.n = (Carton.n || 0) + 1);
    this.cp = el("path", {}, el("clipPath", { id: this.id }, this.g));
    this.far = el("g", {}, this.g);
    this.lf = el("path", { class: cls.lf }, this.g);
    this.rt = el("path", { class: cls.rt }, this.g);
    this.lab = el("g", {}, this.g);
    this.lbox = el("path", { fill: "#fff", stroke: COL.faint, "stroke-width": 0.8 }, this.lab);
    this.bars = el("path", { fill: "none", stroke: COL.ink, "stroke-width": 1, "stroke-linecap": "butt" }, this.lab);
    this.hole = el("path", { class: cls.dp }, this.g);
    this.inn = el("g", { "clip-path": `url(#${this.id})` }, this.g);
    this.wx = el("path", { fill: COL.rt }, this.inn);
    this.wy = el("path", { fill: COL.lf }, this.inn);
    this.cl = el("path", { class: cls.lf }, this.inn);
    this.cr = el("path", { class: cls.rt }, this.inn);
    this.ct = el("path", { class: cls.tp }, this.inn);
    this.near = el("g", {}, this.g);
    this.fb = el("path", { class: "f" }, this.far);
    this.fx0 = el("path", { class: "f" }, this.far);
    this.fx1 = el("path", { class: "f" }, this.near);
    this.ff = el("path", { class: "f" }, this.near);
    this.top = el("path", { class: cls.tp }, this.g);
    this.tape = el("path", { fill: COL.tape, stroke: COL.line, "stroke-width": 0.8, "stroke-linejoin": "round" }, this.g);
    this.late = null;
  }
  set(P, cx, cy, cz, phi) {
    const { w, d, h } = this, x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - d / 2, y1 = cy + d / 2, z0 = cz, zt = cz + h;
    const q = (pts) => pd(pts.map((a) => P(...a)));
    this.lf.setAttribute("d", q([[x0, y1, z0], [x1, y1, z0], [x1, y1, zt], [x0, y1, zt]]));
    this.rt.setAttribute("d", q([[x1, y0, z0], [x1, y1, z0], [x1, y1, zt], [x1, y0, zt]]));
    // shipping label on the left face
    const lx0 = cx - w * 0.28, lx1 = cx + w * 0.14, lz0 = cz + h * 0.2, lz1 = cz + h * 0.52;
    this.lbox.setAttribute("d", q([[lx0, y1, lz0], [lx1, y1, lz0], [lx1, y1, lz1], [lx0, y1, lz1]]));
    let b = "";
    for (let i = 0; i < 6; i++) { const u = lx0 + (lx1 - lx0) * (0.14 + i * 0.145); b += pl([P(u, y1, lz0 + (lz1 - lz0) * 0.2), P(u, y1, lz1 - (lz1 - lz0) * 0.2)]); }
    this.bars.setAttribute("d", b);

    const open = phi > 1.5;
    for (const n of [this.far, this.near, this.hole, this.inn]) n.style.display = open ? "" : "none";
    this.top.style.display = this.tape.style.display = open ? "none" : "";
    if (!open) {
      this.top.setAttribute("d", q([[x0, y0, zt], [x1, y0, zt], [x1, y1, zt], [x0, y1, zt]]));
      this.tape.setAttribute("d", q([[x0, cy - 3, zt], [x1, cy - 3, zt], [x1, cy + 3, zt], [x0, cy + 3, zt]]));
      return cx + cy;
    }
    const late = phi < 70;
    if (late !== this.late) { this.late = late; this.g.insertBefore(this.far, late ? this.near : this.lf); }
    const a = (phi * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), Lj = d / 2, Lm = Math.min(w, d) / 2 - 0.5;
    this.fb.setAttribute("d", q([[x0, y0, zt], [x1, y0, zt], [x1, y0 + Lj * c, zt + Lj * s], [x0, y0 + Lj * c, zt + Lj * s]]));
    this.fx0.setAttribute("d", q([[x0, y0, zt], [x0, y1, zt], [x0 + Lm * c, y1, zt + Lm * s], [x0 + Lm * c, y0, zt + Lm * s]]));
    this.fx1.setAttribute("d", q([[x1, y0, zt], [x1, y1, zt], [x1 - Lm * c, y1, zt + Lm * s], [x1 - Lm * c, y0, zt + Lm * s]]));
    this.ff.setAttribute("d", q([[x0, y1, zt], [x1, y1, zt], [x1, y1 - Lj * c, zt + Lj * s], [x0, y1 - Lj * c, zt + Lj * s]]));
    this.fb.setAttribute("fill", mix(COL.top, COL.lf, s * 0.6));
    this.fx0.setAttribute("fill", mix(COL.top, COL.lf, s * 0.6));
    this.fx1.setAttribute("fill", mix(COL.top, COL.rt, s * 0.9));
    this.ff.setAttribute("fill", mix(COL.top, COL.lf, s * 0.9));
    // the opening and the goods inside it
    const i = 1.6, hx0 = x0 + i, hx1 = x1 - i, hy0 = y0 + i, hy1 = y1 - i;
    const ho = q([[hx0, hy0, zt], [hx1, hy0, zt], [hx1, hy1, zt], [hx0, hy1, zt]]);
    this.hole.setAttribute("d", ho);
    this.cp.setAttribute("d", ho);
    this.wx.setAttribute("d", q([[hx0, hy0, zt], [hx0, hy1, zt], [hx0, hy1, z0], [hx0, hy0, z0]]));
    this.wy.setAttribute("d", q([[hx0, hy0, zt], [hx1, hy0, zt], [hx1, hy0, z0], [hx0, hy0, z0]]));
    const gx0 = x0 + 6, gx1 = x1 - 6, gy0 = y0 + 6, gy1 = y1 - 6, gz0 = zt - 20, gz1 = zt - 6;
    this.cl.setAttribute("d", q([[gx0, gy1, gz0], [gx1, gy1, gz0], [gx1, gy1, gz1], [gx0, gy1, gz1]]));
    this.cr.setAttribute("d", q([[gx1, gy0, gz0], [gx1, gy1, gz0], [gx1, gy1, gz1], [gx1, gy0, gz1]]));
    this.ct.setAttribute("d", q([[gx0, gy0, gz1], [gx1, gy0, gz1], [gx1, gy1, gz1], [gx0, gy1, gz1]]));
    return cx + cy;
  }
}

/** The blue check badge that lands in the scene. */
class Tick {
  constructor(parent) {
    this.g = el("g", {}, parent);
    el("circle", { r: 21, fill: COL.blue, opacity: 0.1 }, this.g);
    el("circle", { r: 15, fill: "#fff", stroke: COL.blue, "stroke-width": 1.8 }, this.g);
    this.c = el("path", { d: "M-6 0.5l4.2 4.2L6.5-4.5", fill: "none", stroke: COL.blue, "stroke-width": 2.4, "stroke-linecap": "round", "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": 1 }, this.g);
    this.g.style.display = "none";
  }
  set(x, y, t) {
    if (t <= 0.001) { this.g.style.display = "none"; return; }
    this.g.style.display = "";
    this.g.setAttribute("transform", `translate(${f1(x)} ${f1(y - 5 * Math.min(1, t))}) scale(${f1(backOut(clamp(t * 1.4)) * 100) / 100})`);
    this.c.setAttribute("stroke-dashoffset", f1(1 - clamp(t * 1.6 - 0.35)) );
  }
}


const IC = {
  package: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  layers: '<path d="M12 4l9 4.5-9 4.5-9-4.5L12 4z"/><path d="M3 12.5l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.6 2.6 4.4-5"/>',
  gauge: '<path d="M4 17a8 8 0 1116 0"/><path d="M12 17l4-5M7 17h1.5M15.5 17H17"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  buyer: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  factory: '<path d="M3 21V10l6 3v-3l6 3V6h3v15H3z"/><path d="M7 17h2M12 17h2"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 14.5l2 2 3.5-4"/>',
  truck: '<path d="M2 6h12v11H2zM14 10h4l3.5 3.5V17H14"/><circle cx="6.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
  home: '<path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/>',
};
const desktopProcessIcons = {"buyer": "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE1LjE3OTgiIGhlaWdodD0iMTcuNjM5NiIgdmlld0JveD0iMCAwIDE1LjE3OTggMTcuNjM5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9Ikdyb3VwIj4KPHBhdGggaWQ9IlZlY3RvciIgZD0iTTIuNDE3OTQgMTYuOTg5NkMxLjM1NjI3IDE2Ljk4OTYgMC40NzI1MDEgMTYuMTIgMC42ODMyODMgMTUuMDc5NEMxLjMzMzU1IDExLjg2OTMgMy42NzM4OSA5LjMwMDM5IDcuNzA0MjggOS4zMDAzOUMxMS43MzM4IDkuMzAwMzkgMTMuOTA1MSAxMS44NjgxIDE0LjUwMTQgMTUuMDc3NEMxNC42OTUzIDE2LjEyMTEgMTMuODEyIDE2Ljk4OTYgMTIuNzUwMyAxNi45ODk2SDIuNDE3OTRaIiBzdHJva2Utd2lkdGg9IjEuMyIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlPSIjMEM1MUVFIi8+CjxwYXRoIGlkPSJWZWN0b3JfMiIgZD0iTTEyLjAyOTUgNC45NzUxOUMxMi4wMjk1IDcuMzYzOTMgMTAuMDkzMSA5LjMwMDM5IDcuNzA0MzQgOS4zMDAzOUM1LjMxNTYgOS4zMDAzOSAzLjM3OTE1IDcuMzYzOTMgMy4zNzkxNSA0Ljk3NTE5QzMuMzc5MTUgMi41ODY0NiA1LjMxNTYgMC42NSA3LjcwNDM0IDAuNjVDMTAuMDkzMSAwLjY1IDEyLjAyOTUgMi41ODY0NiAxMi4wMjk1IDQuOTc1MTlaIiBzdHJva2Utd2lkdGg9IjEuMyIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlPSIjMEM1MUVFIi8+CjwvZz4KPC9zdmc+Cg==", "factory": "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE4Ljc4NzkiIGhlaWdodD0iMTkuMjAxIiB2aWV3Qm94PSIwIDAgMTguNzg3OSAxOS4yMDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJHcm91cCI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik0yLjg2ODI3IDUuMzg4NTFINy42MDY3OEw5LjcxMjc5IDE4LjU1MUgwLjc2MjI2N0wyLjg2ODI3IDUuMzg4NTFaIiBzdHJva2Utd2lkdGg9IjEuMyIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlPSIjMEM1MUVFIi8+CjxwYXRoIGlkPSJWZWN0b3JfMiIgZD0iTTE3LjA4MzkgMC42NUg3LjM0MzZDNi4xODA0OCAwLjY1IDUuMjM3NTkgMS41OTI4OSA1LjIzNzU5IDIuNzU2IiBzdHJva2Utd2lkdGg9IjEuMyIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlPSIjMEM1MUVFIi8+CjxwYXRoIGlkPSJWZWN0b3JfMyIgZD0iTTguODQ4OTMgMTEuMThMMTIuNjA5NiA5LjMzNzI3VjExLjk2OThMMTguMTM3OSA5LjMzNzI3VjE4LjU1MUg5LjQ1MDYyIiBzdHJva2Utd2lkdGg9IjEuMyIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlPSIjMEM1MUVFIi8+CjwvZz4KPC9zdmc+Cg==", "doc": "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE4LjYyNDMiIGhlaWdodD0iMTkuMzQ1NCIgdmlld0JveD0iMCAwIDE4LjYyNDMgMTkuMzQ1NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9Ikdyb3VwIj4KPHBhdGggaWQ9IlZlY3RvciIgZD0iTTYuNTI5NzQgOC42Mjk2OEw4LjI2MjE5IDEwLjM2MjFMMTIuMzA0NSA2LjMxOThNMC42NSAwLjY1SDE3Ljk3NDNWMTUuODc0NEgxMi40NzgzTDkuMzA5OTUgMTguNDk5M0w2LjE3ODU1IDE1Ljg3NDRIMC42NVYwLjY1WiIgc3Ryb2tlLXdpZHRoPSIxLjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZT0iIzBDNTFFRSIvPgo8L2c+Cjwvc3ZnPgo=", "truck": "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjIwLjQ4NTciIGhlaWdodD0iMTYuMzM3MiIgdmlld0JveD0iMCAwIDIwLjQ4NTcgMTYuMzM3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9Ikdyb3VwIj4KPHBhdGggaWQ9IlZlY3RvciIgZD0iTTEyLjU3NjUgMTMuMDk0NUMxMi41NzY1IDE0LjUyNjQgMTMuNzM3MyAxNS42ODcyIDE1LjE2OTIgMTUuNjg3MkMxNi42MDExIDE1LjY4NzIgMTcuNzYxOSAxNC41MjY0IDE3Ljc2MTkgMTMuMDk0NUMxNy43NjE5IDExLjY2MjcgMTYuNjAxMSAxMC41MDE5IDE1LjE2OTIgMTAuNTAxOUMxMy43MzczIDEwLjUwMTkgMTIuNTc2NSAxMS42NjI3IDEyLjU3NjUgMTMuMDk0NVoiIHN0cm9rZS13aWR0aD0iMS4zIiBzdHJva2U9IiMwQzUxRUUiLz4KPHBhdGggaWQ9IlZlY3Rvcl8yIiBkPSJNMi43MjQyNCAxMy4wOTQ1QzIuNzI0MjQgMTQuNTI2NCAzLjg4NTAxIDE1LjY4NzIgNS4zMTY4OSAxNS42ODcyQzYuNzQ4NzggMTUuNjg3MiA3LjkwOTU1IDE0LjUyNjQgNy45MDk1NSAxMy4wOTQ1QzcuOTA5NTUgMTEuNjYyNyA2Ljc0ODc4IDEwLjUwMTkgNS4zMTY4OSAxMC41MDE5QzMuODg1MDEgMTAuNTAxOSAyLjcyNDI0IDExLjY2MjcgMi43MjQyNCAxMy4wOTQ1WiIgc3Ryb2tlLXdpZHRoPSIxLjMiIHN0cm9rZT0iIzBDNTFFRSIvPgo8cGF0aCBpZD0iVmVjdG9yXzMiIGQ9Ik0xMi4zMTc0IDEyLjU3NjNINy42NTA2MSIgc3Ryb2tlLXdpZHRoPSIxLjMiIHN0cm9rZT0iIzBDNTFFRSIvPgo8cGF0aCBpZD0iVmVjdG9yXzQiIGQ9Ik0xNy43OTg2IDEyLjU3NjFIMTkuODM1N1Y2LjA5NDQ2TDE3LjUwMjMgMi43MjQwMUgxMy42MTMzIiBzdHJva2Utd2lkdGg9IjEuMyIgc3Ryb2tlPSIjMEM1MUVFIi8+CjxwYXRoIGlkPSJWZWN0b3JfNSIgZD0iTTIuNjE0MTMgMTIuNTc2MkgwLjY1VjAuNjVIMTMuNjEzM1YxMC43NjE0IiBzdHJva2Utd2lkdGg9IjEuMyIgc3Ryb2tlPSIjMEM1MUVFIi8+CjwvZz4KPC9zdmc+Cg==", "home": "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjI2IiBoZWlnaHQ9IjI2IiB2aWV3Qm94PSIwIDAgMjYgMjYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJEZWxpdmVyZWQgaWNvbiI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik00LjMzMzMzIDIyLjc1VjkuNzVMMTMgNC4zMzMzM0wyMS42NjY3IDkuNzVWMjIuNzUiIHN0cm9rZS13aWR0aD0iMS43IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZT0iIzBDNTFFRSIvPgo8cGF0aCBpZD0iVmVjdG9yXzIiIGQ9Ik05Ljc1IDIyLjc1VjE2LjI1SDE2LjI1VjIyLjc1IiBzdHJva2Utd2lkdGg9IjEuNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2U9IiMwQzUxRUUiLz4KPC9nPgo8L3N2Zz4K"};
const ico = (k) => desktopProcessIcons[k] ? `<img class="figma-process-icon figma-process-icon-${k}" src="${desktopProcessIcons[k]}" alt="" aria-hidden="true">` : `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
const requirementIcons = {
  package: "M12 2.5 21 7.7v8.6l-9 5.2-9-5.2V7.7Zm-9 5.2 9 5.2 9-5.2m-9 5.2v8.6",
  layers: "m2.5 8 9.5-5 9.5 5-9.5 5Zm0 4.5 9.5 5 9.5-5m-19 4.5 9.5 5 9.5-5",
  pin: "M19.5 9.2c0 5-7.5 12-7.5 12s-7.5-7-7.5-12a7.5 7.5 0 0 1 15 0ZM12 6.5a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z",
};
const BOTTOM = {
  list: (c) => `<ul class="list">${c.items.map((t, i) => `<li data-i="${i}"><svg class="tk" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7.2 12.6l3.3 3.2 6.3-6.6" pathLength="1"/></svg><span>${t}</span></li>`).join("")}</ul>`,
  tiles: (c) => `<div class="icons">${c.items.map((t, i) => `<span class="ib" data-i="${i}" title="${t}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${requirementIcons[c.icons[i]]}"/></svg></span>`).join("")}</div>`,
  link: (c) => `<div class="link"><div class="ends"><span class="node">${ico("buyer")}</span><div class="wire"><b>${c.wire}</b><s><u></u></s></div><span class="node far">${ico("factory")}</span></div></div>`,
  track: (c) => `<div class="track">${c.items.map((t, i) => `${i ? `<s class="seg"><u></u></s>` : ""}<div class="stop" data-i="${i}"><span class="ib">${ico(c.icons[i])}</span><span class="tl">${t}</span></div>`).join("")}</div>`,
};

function mountScene(root, cfg) {
  root.innerHTML = `<svg class="fig" viewBox="0 0 480 250" role="img" aria-label="${cfg.label}"></svg>
    ${BOTTOM[cfg.kind || "list"](cfg)}
    ${cfg.pill ? `<div class="pill"><i></i><span>${cfg.pill}</span></div>` : ""}`;
  const svg = root.querySelector(".fig");
  if (matchMedia('(max-width:767px)').matches) {
    svg.setAttribute('viewBox', cfg.id === 'inspection' ? '0 0 480 250' : '65 25 350 225');
  }
  const items = [...root.querySelectorAll("[data-i]")];
  const pill = root.querySelector(".pill");
  if (cfg.inline) {
    const foot = document.createElement("div");
    foot.className = "foot";
    const icons = root.querySelector(".icons");
    icons.before(foot);
    foot.append(icons, pill);
  }
  const scene = cfg.scene(svg);
  return (progress) => {
    scene.draw(progress);
    items.forEach((item, index) => item.classList.toggle("on", progress >= cfg.at[index]));
    if (pill) pill.classList.toggle("on", progress >= cfg.done);
    const k = cfg.k ? raw(progress, cfg.k[0], cfg.k[1]) : 0;
    root.style.setProperty("--k", k);
    root.style.setProperty("--a1", clamp(k * 2));
    root.style.setProperty("--a2", clamp(k * 2 - 1));
    root.classList.toggle("arrived", k >= 0.999);
  };
}

/* The four scenes. Each takes an svg and returns { draw(p) } with p running 0..1. */

/* ---------- 3 · Pre-shipment inspection (the reference) ---------- */
function sceneInspection(svg) {
  const I = iso();
  const BL = 348, BH = 7, CS = 28, CZ = 26, Y = 22, GX = 258, XS = [22, 76, 130, 184], XE = 314;
  I.fit([[0, -14, 0], [BL, -14, 0], [0, 58, 0], [BL, 58, 0], [GX, -14, 70], [XE, Y, BH + CZ + 46], [XS[0] - 15, Y - 15, BH + CZ + 4], [XS[3], Y - 15, BH + CZ + 22]], 480, 250, 14);
  const P = I.P, st = new Stack(el("g", {}, svg)), add = (g, k) => st.add(g, k);

  const belt = el("g"); rrSolid(belt, P, 0, 0, BL, 44, 0, BH, 22);
  el("path", { d: pd(rr(4, 4, BL - 4, 40, 18).map((q) => P(q[0], q[1], BH))), fill: "#f7f9fc", stroke: COL.faint, "stroke-width": 0.8 }, belt);
  const slats = el("path", { fill: "none", stroke: COL.faint, "stroke-width": 1 }, belt);
  add(belt, -2e6);

  // the portal: two posts on round base plates, a beam across, a sensor on the far post
  const far = el("g");
  rrSolid(far, P, GX - 7, -14, GX + 7, 0, 0, 2, 6);
  rrSolid(far, P, GX - 3.5, -10.5, GX + 3.5, -3.5, 2, 62, 2.4);
  add(far, -1e6);
  const sens = el("g");
  box(sens, P, GX - 3.5, -3.5, 30, GX + 3.5, 4, 44);
  for (const z of [40.5, 34]) { const [cx, cy] = P(GX + 3.5, 0.25, z); el("circle", { cx: f1(cx), cy: f1(cy), r: 1.7, fill: COL.blue }, sens); }
  add(sens, -1e6 + 1);

  const beam = el("path", { fill: "none", stroke: COL.blue, "stroke-width": 1.4, "stroke-dasharray": "5 4", "stroke-linecap": "round" });
  beam.setAttribute("d", pl([P(GX, 4.5, 37), P(GX, 48.5, 37)]));
  add(beam, 8e5);
  const sheet = el("path", { fill: COL.blue, d: pd([[GX, 2, BH], [GX, 42, BH], [GX, 42, 58], [GX, 2, 58]].map((q) => P(...q))) });
  add(sheet, 8e5 - 1);

  const cartons = XS.map((x) => ({ x, c: new Carton(el("g", {}, svg), CS, CS, CZ) }));
  cartons.forEach((o) => { o.it = st.add(o.c.g, 0); });

  const near = el("g");
  rrSolid(near, P, GX - 7, 44, GX + 7, 58, 0, 2, 6);
  rrSolid(near, P, GX - 3.5, 47.5, GX + 3.5, 54.5, 2, 62, 2.4);
  rrSolid(near, P, GX - 3.5, -11, GX + 3.5, 56, 60, 65, 2.6);
  quad(near, P, [[GX + 3.5, -6, 62], [GX + 3.5, 51, 62], [GX + 3.5, 51, 63.6], [GX + 3.5, -6, 63.6]], COL.blue, "none");
  add(near, 1e6);

  const tick = new Tick(svg), tp = P(XE + 12, Y + 8, BH + CZ + 30);

  return {
    draw(p) {
      const q4 = seg(p, 0.28, 0.66), off = 54 * seg(p, 0.28, 0.8);
      let s = ""; for (let k = -1; k < 30; k++) { const x = 12 + ((k * 14 + off) % 324); if (x > 8 && x < BL - 8) s += pl([P(x, 5, BH), P(x, 39, BH)]); }
      slats.setAttribute("d", s);
      cartons.forEach((o, i) => {
        let x = o.x, phi = 0;
        if (i === 3) { phi = 118 * (1 - seg(p, 0.02, 0.24)); x = lerp(XS[3], XE, q4); }
        else { x = o.x + 54 * seg(p, 0.38 + i * 0.05, 0.7 + i * 0.05); }
        o.it.key = o.c.set(P, x, Y, BH, phi);
      });
      st.sort();
      const pulse = Math.sin(Math.PI * raw(p, 0.36, 0.6));
      sheet.setAttribute("opacity", f1(0.03 + 0.17 * pulse));
      beam.setAttribute("opacity", f1(0.45 + 0.55 * pulse));
      tick.set(tp[0], tp[1], raw(p, 0.7, 0.84));
    },
  };
}

function sceneRequirement(svg) {
  const I = iso(); I.fit([[20, -4, 0], [170, -4, 0], [20, 136, 0], [170, 136, 0], [46, 22, 66], [142, 22, 66]], 480, 250, 14);
  const P = I.P, st = new Stack(el("g", {}, svg)), TX0 = 46, TX1 = 142, TY0 = 22, TY1 = 84, TH = 24;

  const desk = el("g"); rrSolid(desk, P, 20, -4, 170, 136, -6, 0, 16, { top: COL.floor }); st.add(desk, -3e6);

  const tray = el("g");
  box(tray, P, TX0, TY0, 0, TX1, TY1, TH);
  const i0 = 6, f0 = 17;
  quad(tray, P, [[TX0 + i0, TY0 + i0, f0], [TX1 - i0, TY0 + i0, f0], [TX1 - i0, TY1 - i0, f0], [TX0 + i0, TY1 - i0, f0]], COL.deep, COL.line);
  quad(tray, P, [[TX0 + i0, TY0 + i0, TH], [TX0 + i0, TY1 - i0, TH], [TX0 + i0, TY1 - i0, f0], [TX0 + i0, TY0 + i0, f0]], COL.rt, COL.line);
  quad(tray, P, [[TX0 + i0, TY0 + i0, TH], [TX1 - i0, TY0 + i0, TH], [TX1 - i0, TY0 + i0, f0], [TX0 + i0, TY0 + i0, f0]], COL.lf, COL.line);
  // a few cards already waiting in the tray
  for (let k = 0; k < 3; k++) quad(tray, P, [[TX0 + 14 + k * 3, TY0 + 12, f0 + 0.2], [TX1 - 14 - k * 3, TY0 + 12, f0 + 0.2], [TX1 - 14 - k * 3, TY1 - 12, f0 + 0.2], [TX0 + 14 + k * 3, TY1 - 12, f0 + 0.2]].map((q) => [q[0], q[1], q[2] + k * 1.2]), "#fff", COL.faint, 0.7);
  const SZ = 11, slot = [[60, TY1, SZ - 2.6], [128, TY1, SZ - 2.6], [128, TY1, SZ + 2.6], [60, TY1, SZ + 2.6]];
  quad(tray, P, slot, COL.deep, COL.line, 1);
  const edge = el("path", { fill: "none", stroke: COL.blue, "stroke-width": 2.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, tray);
  edge.setAttribute("d", pl([P(TX0, TY1, TH), P(TX1, TY1, TH), P(TX1, TY1, TH), P(TX1, TY0, TH)]));
  const slotEdge = el("path", { fill: "none", stroke: COL.blue, "stroke-width": 1.6, "stroke-linejoin": "round" }, tray);
  slotEdge.setAttribute("d", pd(slot.map((q) => P(...q))));
  st.add(tray, 0);

  const shadow = el("path", { fill: "#e6eaf1" }, svg), card = el("g");
  const cTop = el("path", { class: cls.tp }, card), cFront = el("path", { class: cls.lf }, card), cSide = el("path", { class: cls.rt }, card);
  const bars = [0, 1, 2].map((k) => el("path", { fill: k === 0 ? COL.blue : COL.faint }, card));
  const dots = el("path", { fill: COL.ink }, card);
  st.add(shadow, -1); st.add(card, 1);
  const cx0 = 70, cx1 = 120, CL = 62, cz0 = SZ - 0.9, cz1 = SZ + 0.9;
  const tick = new Tick(svg), tp = P(94, 50, TH + 38);

  return {
    draw(p) {
      const L = lerp(46, 6, seg(p, 0.42, 0.78)), ye = TY1 + L, q = (a) => pd(a.map((v) => P(...v)));
      cTop.setAttribute("d", q([[cx0, TY1, cz1], [cx1, TY1, cz1], [cx1, ye, cz1], [cx0, ye, cz1]]));
      cFront.setAttribute("d", q([[cx0, ye, cz0], [cx1, ye, cz0], [cx1, ye, cz1], [cx0, ye, cz1]]));
      cSide.setAttribute("d", q([[cx1, TY1, cz0], [cx1, ye, cz0], [cx1, ye, cz1], [cx1, TY1, cz1]]));
      shadow.setAttribute("d", q([[cx0, TY1, 0], [cx1, TY1, 0], [cx1, ye, 0], [cx0, ye, 0]]));
      const offs = [10, 24, 36], span = [[0.05, 0.16], [0.16, 0.27], [0.27, 0.38]];
      bars.forEach((b, k) => {
        const y = ye - offs[k], len = (cx1 - cx0 - 12) * lerp(0.18, 1, seg(p, span[k][0], span[k][1])) * (k === 0 ? 0.62 : 1);
        b.setAttribute("d", y > TY1 + 2 ? q([[cx0 + 6, y - (k ? 1.4 : 2.2), cz1], [cx0 + 6 + len, y - (k ? 1.4 : 2.2), cz1], [cx0 + 6 + len, y + (k ? 1.4 : 2.2), cz1], [cx0 + 6, y + (k ? 1.4 : 2.2), cz1]]) : "");
      });
      dots.setAttribute("d", ye - 50 > TY1 + 2 ? "" : "");
      const hot = raw(p, 0.62, 0.76);
      edge.setAttribute("opacity", f1(hot)); slotEdge.setAttribute("opacity", f1(hot));
      st.sort();
      tick.set(tp[0], tp[1], raw(p, 0.78, 0.9));
    },
  };
}

/* ---------- 2 · Match to a verified source ---------- */
function sceneSource(svg) {
  const I = iso(); I.fit([[-10, -10, 0], [250, -10, 0], [-10, 126, 0], [250, 126, 0], [8, 0, 62], [236, 0, 62]], 480, 250, 20);
  const P = I.P, st = new Stack(el("g", {}, svg)), X0 = [8, 92, 176], FW = 58;

  const ground = el("g"); rrSolid(ground, P, -10, -10, 250, 126, -6, 0, 16, { top: COL.floor }); st.add(ground, -3e6);

  const pads = X0.map((x) => el("path", { d: pd(rr(x + 4, 48, x + FW - 4, 84, 5).map((q) => P(q[0], q[1], 0))), fill: "none", stroke: COL.faint, "stroke-width": 1.2, "stroke-dasharray": "4 3", "stroke-linejoin": "round" }, svg));
  pads.forEach((pd_) => st.add(pd_, -2e6));
  const padFill = el("path", { d: pads[1].getAttribute("d"), fill: COL.blue, opacity: 0 }, svg); st.add(padFill, -2e6 + 1);

  X0.forEach((x, i) => {
    const f = el("g");
    box(f, P, x, 4, 0, x + FW, 44, 30);
    box(f, P, x + 4, 8, 30, x + 24, 40, 37);
    box(f, P, x + 30, 8, 30, x + 50, 40, 37);
    box(f, P, x + FW - 12, 8, 30, x + FW - 6, 14, 54);
    quad(f, P, [[x + 20, 44, 0], [x + 38, 44, 0], [x + 38, 44, 19], [x + 20, 44, 19]], COL.deep, COL.line);
    [[12, 20], [24, 32]].forEach(([a, b]) => quad(f, P, [[x + FW, a, 15], [x + FW, b, 15], [x + FW, b, 23], [x + FW, a, 23]], "#fff", COL.faint, 0.9));
    if (i === 1) quad(f, P, [[x, 44, 25], [x + FW, 44, 25], [x + FW, 44, 28], [x, 44, 28]], COL.blue, "none");
    st.add(f, x + 24 + 2 * i);
  });

  const sel = el("path", { fill: COL.blue, "fill-opacity": 0.07, stroke: COL.blue, "stroke-width": 1.6, "stroke-dasharray": "5 4", "stroke-linejoin": "round" }, svg);
  st.add(sel, -1e6);
  const trail = el("path", { fill: "none", stroke: COL.blue, "stroke-width": 2, "stroke-dasharray": "2 5", "stroke-linecap": "round" }, svg); st.add(trail, -1e6 + 1);
  const car = new Carton(el("g", {}, svg), 26, 26, 24), cit = st.add(car.g, 0);
  const tick = new Tick(svg), tp = P(X0[1] + FW / 2, 24, 70);

  return {
    draw(p) {
      const xs = [X0[0], X0[2], X0[1]], h1 = seg(p, 0.1, 0.3), h2 = seg(p, 0.34, 0.5);
      const sx = p < 0.32 ? lerp(xs[0], xs[1], h1) : lerp(xs[1], xs[2], h2);
      const lift = Math.sin(Math.PI * (p < 0.32 ? raw(p, 0.1, 0.3) : raw(p, 0.34, 0.5))) * 5;
      sel.setAttribute("d", pd(rr(sx - 5, -2, sx + FW + 5, 52, 6).map((q) => P(q[0], q[1], lift))));
      const cx = X0[1] + FW / 2, m = seg(p, 0.52, 0.8), cy = lerp(112, 66, m);
      trail.setAttribute("d", pl([P(cx, 112, 0.2), P(cx, cy, 0.2)]));
      cit.key = car.set(P, cx, cy, 0, 0);
      const on = raw(p, 0.74, 0.84);
      padFill.setAttribute("opacity", f1(0.12 * on)); pads[1].setAttribute("stroke", mix(COL.faint, COL.blue, on));
      st.sort();
      tick.set(tp[0], tp[1], raw(p, 0.8, 0.92));
    },
  };
}

/* ---------- 4 · Deliver to the facility ---------- */
function sceneDelivery(svg) {
  const I = iso(); I.fit([[-10, 0, 0], [292, 0, 0], [-10, 100, 0], [292, 100, 0], [0, 8, 52], [100, 50, 80]], 480, 250, 18);
  const P = I.P, st = new Stack(el("g", {}, svg)), BX = 72;

  const ground = el("g"); rrSolid(ground, P, -10, 0, 292, 100, -6, 0, 16, { top: COL.floor }); st.add(ground, -3e6);
  const pad = el("path", { d: pd(rr(80, 30, 122, 70, 5).map((q) => P(q[0], q[1], 0))), fill: COL.blue, "fill-opacity": 0, stroke: COL.faint, "stroke-width": 1.3, "stroke-dasharray": "4 3", "stroke-linejoin": "round" }, svg);
  st.add(pad, -2e6);

  const bld = el("g");
  box(bld, P, 0, 8, 0, BX, 92, 46);
  quad(bld, P, [[BX, 8, 37], [BX, 92, 37], [BX, 92, 41], [BX, 8, 41]], COL.blue, "none");
  quad(bld, P, [[BX, 32, 0], [BX, 68, 0], [BX, 68, 28], [BX, 32, 28]], COL.deep, COL.line);
  box(bld, P, BX, 28, 30, BX + 8, 72, 33);
  st.add(bld, 40);
  const door = el("g"); st.add(door, 41);
  const dpanel = el("path", { fill: "#fff", stroke: COL.line, "stroke-width": 1, "stroke-linejoin": "round" }, door), dlines = el("path", { fill: "none", stroke: COL.faint, "stroke-width": 1 }, door);

  const trail = el("path", { fill: "none", stroke: COL.blue, "stroke-width": 2, "stroke-dasharray": "2 5", "stroke-linecap": "round" }, svg); st.add(trail, -1e6);
  const truck = el("g");
  box(truck, P, 206, 28, 8, 266, 68, 46);
  box(truck, P, 206, 30, 3, 292, 66, 8);
  box(truck, P, 268, 32, 8, 292, 64, 30);
  quad(truck, P, [[292, 36, 16], [292, 60, 16], [292, 60, 27], [292, 36, 27]], "#fff", COL.faint, 0.9);
  quad(truck, P, [[266, 30, 36], [266, 66, 36], [266, 66, 40], [266, 30, 40]], COL.blue, "none");
  [[222, 6], [250, 6], [280, 6]].forEach(([wx, wz]) => {
    const ring = Array.from({ length: 16 }, (_, k) => [wx + 6 * Math.cos((k / 16) * 6.2832), 68.6, wz + 6 * Math.sin((k / 16) * 6.2832)]);
    quad(truck, P, ring, COL.ink, "#7f8aa0", 1);
    const [hx, hy] = P(wx, 68.6, wz); el("circle", { cx: f1(hx), cy: f1(hy), r: 1.8, fill: "#fff" }, truck);
  });
  st.add(truck, 400);
  const car = new Carton(el("g", {}, svg), 34, 34, 32), cit = st.add(car.g, 0);
  const tick = new Tick(svg), tp = P(124, 62, 50);

  return {
    draw(p) {
      const m = seg(p, 0.1, 0.62), cx = lerp(176, 101, m);
      trail.setAttribute("d", pl([P(176, 50, 0.2), P(cx, 50, 0.2)]));
      cit.key = car.set(P, cx, 50, 0, 0);
      const op = seg(p, 0.6, 0.8), top = 28, bot = lerp(0, top - 1, op);
      const q = [[BX, 33, bot], [BX, 67, bot], [BX, 67, top], [BX, 33, top]].map((v) => P(...v));
      dpanel.setAttribute("d", op > 0.99 ? "" : pd(q));
      let l = ""; for (let k = 1; k < 5; k++) { const z = bot + ((top - bot) * k) / 5; l += pl([P(BX, 33, z), P(BX, 67, z)]); }
      dlines.setAttribute("d", op > 0.99 ? "" : l);
      const on = raw(p, 0.58, 0.7);
      pad.setAttribute("fill-opacity", f1(0.12 * on)); pad.setAttribute("stroke", mix(COL.faint, COL.blue, on));
      st.sort();
      tick.set(tp[0], tp[1], raw(p, 0.72, 0.86));
    },
  };
}

const CARDS = [
  { id: "requirement", label: "A requirement card slides into the intake tray.", scene: sceneRequirement,
    kind: "tiles", inline: true, icons: ["package", "layers", "pin"], items: ["Product", "Quantity", "Destination"], at: [0.16, 0.27, 0.38], pill: "Requirement received", done: 0.88 },
  { id: "source", label: "A selector checks three factories and the order is routed to the verified one.", scene: sceneSource,
    kind: "link", wire: "Direct Line", icons: [], items: [], at: [], k: [0.52, 0.8], pill: "Source matched", done: 0.92 },
  { id: "inspection", label: "An open carton is closed and passes through an inspection gantry.", scene: sceneInspection,
    items: ["Product specifications", "Shipment quantity", "Packaging condition"], at: [0.3, 0.5, 0.7], pill: "Inspection complete", done: 0.88 },
  { id: "delivery", label: "A carton travels from the truck to the facility dock and the door opens.", scene: sceneDelivery,
    kind: "track", icons: ["doc", "truck", "home"], items: ["Confirmed", "In transit", "Delivered"], at: [0.1, 0.38, 0.66], k: [0.1, 0.62], pill: null, done: 1 },
];


/* ---------- controller ---------- */
const section=document.querySelector('[data-process="section"]');
if(section){
const stage=section.querySelector('[data-process="stage"]');
const steps=[...section.querySelectorAll('[data-process-step]')];
const dots=[...section.querySelectorAll('[data-process-dot]')];
const scenes=[...section.querySelectorAll('[data-process-scene]')];
const status=section.querySelector('[data-process="status"]');
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
scenes.forEach((s,i)=>s.setAttribute('data-proc-scene',CARDS[i].id));
scenes.forEach(n=>{const w=n.parentElement;if(w.querySelector('.process_frame'))return;const f=document.createElement('span');f.className='process_frame';f.setAttribute('aria-hidden','true');f.innerHTML='<i></i><b></b>';w.insertBefore(f,w.firstChild);});
const draw=scenes.map((s,i)=>mountScene(s,CARDS[i]));
const dur=[1.5,1.5,2,2.18],total=dur.reduce((a,b)=>a+b,0);
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let active=-1,raf=0,vh=innerHeight,U=innerHeight;const stack=matchMedia('(max-width:991px)');
const C=163.36281798666926;
function fit(){
  /* phones: scale each scene down so it sits fully inside the dashed frame and never spills into the neighbouring scene */
  const phone=matchMedia('(max-width:767px)').matches;
  scenes.forEach(n=>{
    if(!phone){n.style.removeProperty('transform');n.style.removeProperty('transform-origin');return;}
    n.style.transform='none';
    const h=n.offsetHeight,k=h?Math.min(1,Math.max(.6,(U*.74-16)/h)):1;
    n.style.transformOrigin='50% 50%';n.style.transform=k<1?'scale('+k.toFixed(3)+')':'none';
  });
}
function size(){vh=innerHeight;const sh=stack.matches?Math.max(0,-(parseFloat(getComputedStyle(stage).top)||0)):0;stage.style.height=(vh+sh)+'px';const v=scenes[0].parentElement.parentElement;U=stack.matches?Math.max(200,v.clientHeight):vh;section.style.setProperty('--ph',U+'px');section.style.height=((total+1)*vh+sh)+'px';fit();}
function center(){
  if(stack.matches){scenes.forEach(n=>n.style.removeProperty('--optical-offset'));return;}
  scenes.forEach(n=>{
    const w=n.parentElement,svg=n.querySelector('svg.fig'),wr=w.getBoundingClientRect();
    if(!svg||!wr.height)return;
    const box=svg.getBBox(),m=svg.getScreenCTM();if(!m||!box.width||!box.height)return;
    const c=[[box.x,box.y],[box.x+box.width,box.y+box.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));
    let top=Math.min(c[0].y,c[1].y),bottom=Math.max(c[0].y,c[1].y);
    [...n.children].filter(e=>e!==svg).forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&r.height){top=Math.min(top,r.top);bottom=Math.max(bottom,r.bottom);}});
    const cur=parseFloat(n.style.getPropertyValue('--optical-offset'))||0;
    n.style.setProperty('--optical-offset',(cur+(wr.top+wr.bottom-top-bottom)/2)+'px');
  });
}
function flag(n,on){n.classList.toggle('is-active',on)}
function activate(i){
  active=i;
  steps.forEach((n,k)=>{const on=k===i;flag(n,on);n.setAttribute('aria-expanded',String(on));
    n.querySelectorAll('.process_step-num-muted,.process_step-title-muted,.process_desc-wrap').forEach(e=>flag(e,on));});
  dots.forEach((n,k)=>{const on=k===i;flag(n,on);n.setAttribute('aria-current',on?'step':'false');
    const c=n.querySelector('.process_circle');if(c)flag(c,on);});
  scenes.forEach((n,k)=>{const p=n.parentElement;flag(p,k===i);p.setAttribute('aria-hidden',String(k!==i));});
}
dots.forEach(d=>{const c=d.querySelector('.process_circle');if(!c||c.querySelector('[data-process-ring]'))return;
  c.insertAdjacentHTML('beforeend','<svg viewBox="0 0 60 60" aria-hidden="true" style="position:absolute;inset:-1px;width:calc(100% + 2px);height:calc(100% + 2px);transform:rotate(-90deg);pointer-events:none"><circle data-process-track cx="30" cy="30" r="26" fill="none" stroke-width="1.43"/><circle data-process-ring cx="30" cy="30" r="26" fill="none" stroke="#151515" stroke-width="1.43" stroke-dasharray="163.36" stroke-dashoffset="163.36"/></svg>');});
function render(){
  raf=0;
  const travel=clamp(-section.getBoundingClientRect().top/vh,0,total-.00001);
  let off=0,i=0;
  for(;i<dur.length-1&&travel>=off+dur[i];i++)off+=dur[i];
  if(i!==active)activate(i);
  const p=clamp((travel-off)/(i===3?.93:dur[i]-1));
  draw[i](reduced.matches?1:p);
  const t=i<3?clamp(travel-off-(dur[i]-1)):0;
  if(t>0&&!reduced.matches)draw[i+1](0);
  scenes.forEach((n,k)=>{
    const w=n.parentElement,d=k-(i+t),a=Math.abs(d);
    w.style.transition='none';
    w.style.opacity='1';
    w.style.transform='translate3d(0,'+(d*U).toFixed(1)+'px,0)';
    w.style.pointerEvents=a<.5?'auto':'none';
  });
  dots.forEach((d,k)=>{const r=d.querySelector('[data-process-ring]');if(r)r.style.strokeDashoffset=C*(1-(k===i?p:(k<i?1:0)));});
}
function schedule(){if(!raf)raf=requestAnimationFrame(render)}
function go(n){
  const i=Number(n)-1;if(i<0||i>3)return;
  const off=dur.slice(0,i).reduce((a,b)=>a+b,0)+(dur[i]-1)*.5*(i===3?.93:1)*0;
  const y=section.getBoundingClientRect().top+scrollY+(off+.02)*vh;
  if(window.lenis&&window.lenis.scrollTo)window.lenis.scrollTo(y,{duration:1});else scrollTo({top:y,behavior:reduced.matches?'auto':'smooth'});
}
[...steps,...dots].forEach(n=>{
  const k=n.getAttribute('data-process-step')||n.getAttribute('data-process-dot');
  n.addEventListener('click',()=>go(k));
  n.setAttribute('role','button');n.tabIndex=0;
  n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(k)}});
});
size();render();center();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{size();center();schedule()});
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{size();center();schedule()});
stack.addEventListener('change',()=>{size();center();schedule()});
addEventListener('load',()=>{size();center();schedule()});
}

}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
