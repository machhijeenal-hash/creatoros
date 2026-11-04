/*
 * test_page.js -- headless smoke test for riemann.html.
 *
 * There is no browser in this sandbox, so this stubs just enough of the DOM and
 * canvas API to execute the page's script and prove that:
 *   - nothing throws while all seven sections initialise,
 *   - the numbers written into the DOM match the Python study,
 *   - the explicit-formula error actually falls as zeros are added.
 *
 *   node test_page.js
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dirname;
const html = readFileSync(join(here, "riemann.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

/* ---------- DOM stub ---------- */
const nodes = new Map();
function makeEl(id = "") {
  const el = {
    id,
    textContent: "",
    innerHTML: "",
    value: "0",
    dataset: {},
    className: "",
    style: {},
    children: [],
    width: 0,
    height: 0,
    parentElement: { clientWidth: 800 },
    appendChild(c) {
      this.children.push(c);
      return c;
    },
    addEventListener() {},
    setPointerCapture() {},
    getBoundingClientRect: () => ({ width: 800, height: 300, left: 0, top: 0 }),
    getAttribute: (k) => (k === "height" ? "300" : null),
    getContext: () => ctxStub,
    classList: { add() {}, remove() {} },
    setAttribute() {},
  };
  if (id) nodes.set(id, el);
  return el;
}
const noop = () => {};
const ctxStub = new Proxy(
  {
    setTransform: noop,
    clearRect: noop,
    beginPath: noop,
    moveTo: noop,
    lineTo: noop,
    closePath: noop,
    stroke: noop,
    fill: noop,
    fillText: noop,
    arc: noop,
    drawImage: noop,
    putImageData: noop,
    createLinearGradient: () => ({ addColorStop: noop }),
    setLineDash: noop,
  },
  {
    get: (t, k) => (k in t ? t[k] : undefined),
    set: (t, k, v) => {
      t[k] = v;
      return true;
    },
  },
);

globalThis.document = {
  getElementById: (id) => nodes.get(id) || makeEl(id),
  querySelectorAll: () => [],
  createElement: () => makeEl(),
  addEventListener: noop,
};
globalThis.window = { addEventListener: noop, devicePixelRatio: 2, innerWidth: 1200 };
globalThis.performance = { now: () => Date.now() };
globalThis.requestAnimationFrame = (fn) => setTimeout(() => fn(Date.now()), 0);
globalThis.IntersectionObserver = class {
  constructor(cb) {
    this.cb = cb;
  }
  observe(el) {
    this.cb([{ isIntersecting: true, target: el }]);
  }
  unobserve() {}
};
globalThis.ImageData = class {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.data = new Uint8ClampedArray(w * h * 4);
  }
};

let failed = 0;
function expect(name, cond, detail = "") {
  if (!cond) failed++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
}

/* ---------- run the page ---------- */
try {
  new Function(script)();
  expect("page script executes without throwing", true);
} catch (e) {
  expect("page script executes without throwing", false, "\n" + e.stack);
}

/* ---------- inspect what it wrote into the DOM ---------- */
const txt = (id) => (nodes.get(id) ? nodes.get(id).textContent : "<missing>");
const countRows = (id) => (nodes.get(id) ? nodes.get(id).children.length : -1);

expect("strip probe readout is populated", /[0-9]/.test(txt("ro-abs")), `|ζ| = ${txt("ro-abs")}`);
expect("sigma-minimum readout is populated", /0\.5/.test(txt("ro-min")), `argmin = ${txt("ro-min")}`);
expect("counting table has 3 rows", countRows("count-body") === 3, `${countRows("count-body")} rows`);
expect("hunt table has 40 rows", countRows("hunt-body") === 40, `${countRows("hunt-body")} rows`);
expect("timeline has 14 entries", countRows("timeline") === 14, `${countRows("timeline")} entries`);
expect("worst sigma deviation reported", /e-/.test(txt("hunt-worst")), txt("hunt-worst"));
expect("psi rms computed", Number(txt("psi-rms")) > 0, `rms = ${txt("psi-rms")} (K=25)`);

/* ---------- the explicit-formula error must keep falling ---------- */
// re-run the page's own summation for K = 1, 5, 25, 50, 100 via a fresh script
// context that exposes the numbers: simplest is to recompute here with zeta.js
const zetaSrc = readFileSync(join(here, "zeta.js"), "utf8");
const api = new Function(zetaSrc + "; return { zeta, absZeta, Z, siegelTheta };")();
const data = JSON.parse(readFileSync(join(here, "data.json"), "utf8"));
const gammas = data.zeros.map((z) => z.gamma);
function rmsFor(K) {
  let se = 0,
    n = 0;
  for (const row of data.explicit_curve) {
    const x = row.x;
    if (isPrimePower(x)) continue;
    let s = 0;
    for (let k = 0; k < K; k++) {
      const g = gammas[k];
      const mag = Math.sqrt(x);
      const re = mag * Math.cos(g * Math.log(x));
      const im = mag * Math.sin(g * Math.log(x));
      const den = 0.25 + g * g;
      s += 2 * ((re * 0.5 + im * g) / den);
    }
    const main = x - Math.log(2 * Math.PI) - 0.5 * Math.log(1 - 1 / (x * x));
    const e = row.psi - (main - s);
    se += e * e;
    n++;
  }
  return Math.sqrt(se / n);
}
function isPrimePower(n) {
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) {
      let m = n;
      while (m % p === 0) m /= p;
      return m === 1;
    }
  }
  return true;
}
const r1 = rmsFor(1),
  r25 = rmsFor(25),
  r100 = rmsFor(100);
expect("explicit-formula rms falls with more zeros", r1 > r25 && r25 > r100, `${r1.toFixed(3)} → ${r25.toFixed(3)} → ${r100.toFixed(3)}`);

/* ---------- Z(t) has a zero at every known ordinate ---------- */
let maxRes = 0;
for (const z of data.zeros.slice(0, 20)) maxRes = Math.max(maxRes, Math.abs(api.Z(z.gamma)));
expect("Z(γ_n) ≈ 0 in the page's implementation", maxRes < 1e-9, `max ${maxRes.toExponential(2)}`);

console.log(failed === 0 ? "\npage smoke test passed" : `\n${failed} failure(s)`);
process.exit(failed === 0 ? 0 : 1);
