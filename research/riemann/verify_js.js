#!/usr/bin/env node
/*
 * verify_js.js -- validate the JavaScript zeta implementation shipped in the
 * interactive page against the mpmath reference values produced by zeta_lab.py.
 *
 *   node verify_js.js
 *
 * Exits non-zero if any check fails. Every number quoted on the page as
 * "verified" is checked here.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dirname;
const api = new Function(
  readFileSync(join(here, "zeta.js"), "utf8") +
    "; return { zeta, absZeta, Z, siegelTheta };",
)();
const data = JSON.parse(readFileSync(join(here, "data.json"), "utf8"));

let failures = 0;
function check(name, value, limit, unit = "") {
  const ok = value <= limit;
  if (!ok) failures++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${name.padEnd(52)} ${value.toExponential(2)}${unit}  (limit ${limit.toExponential(0)}${unit})`,
  );
}

// 1. zeta against mpmath
let maxAbs = 0;
for (const r of data.reference) {
  const v = api.zeta(parseFloat(r.s), parseFloat(r.t));
  maxAbs = Math.max(maxAbs, Math.hypot(v[0] - parseFloat(r.re), v[1] - parseFloat(r.im)));
}
check("|zeta_js - zeta_mpmath| on 40 reference points", maxAbs, 1e-10);

// 2. Riemann-Siegel theta, including t -> 0 where naive Stirling fails
let maxTheta = 0;
for (const z of data.zeros) {
  maxTheta = Math.max(maxTheta, Math.abs(api.siegelTheta(z.gamma) - z.theta));
}
for (const r of data.theta_ref || []) {
  maxTheta = Math.max(maxTheta, Math.abs(api.siegelTheta(parseFloat(r.t)) - parseFloat(r.theta)));
}
check("|theta_js - theta_mpmath| over t in [0, 150]", maxTheta, 1e-10);

// 3. the located zeros really are zeros
let maxZ = 0;
let maxZeta = 0;
for (const z of data.zeros) {
  maxZ = Math.max(maxZ, Math.abs(api.Z(z.gamma)));
  maxZeta = Math.max(maxZeta, api.absZeta(0.5, z.gamma));
}
check("max |Z(gamma_n)| at the 100 zeros", maxZ, 1e-9);
check("max |zeta(1/2 + i gamma_n)| at the 100 zeros", maxZeta, 1e-9);

// 4. counterexample hunt, in JS: sweep sigma at each ordinate
let maxSigmaGap = 0;
for (const z of data.zeros.slice(0, 40)) {
  let best = Infinity;
  let argbest = NaN;
  for (let i = 0; i <= 490; i++) {
    const sig = 0.01 + (i * (0.98 - 0.01)) / 490;
    const v = api.absZeta(sig, z.gamma);
    if (v < best) {
      best = v;
      argbest = sig;
    }
  }
  maxSigmaGap = Math.max(maxSigmaGap, Math.abs(argbest - 0.5));
}
check("max |argmin_sigma |zeta|| - 1/2 (40 zeros)", maxSigmaGap, 2e-3);

// 5. sign changes of Z reproduce the on-line zero count from the Python study
const want = data.counts[2].on_line_zeros; // T = 150
let count = 0;
let prev = api.Z(0.5);
for (let t = 0.5; t < 150; t += 0.01) {
  const cur = api.Z(t + 0.01);
  if ((prev < 0 && cur > 0) || (prev > 0 && cur < 0)) count++;
  prev = cur;
}
const countsOk = count === want;
if (!countsOk) failures++;
console.log(
  `${countsOk ? "PASS" : "FAIL"}  ${"sign changes of Z on (0.5,150)".padEnd(52)} ${String(count).padStart(4)} zeros (python: ${want})`,
);

console.log(
  failures === 0
    ? "\nall checks passed -- the page's numbers are reproducible"
    : `\n${failures} check(s) FAILED`,
);
process.exit(failures === 0 ? 0 : 1);
