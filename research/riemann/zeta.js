/*
 * zeta.js -- complex Riemann zeta function in plain JavaScript.
 *
 * Euler-Maclaurin summation:
 *
 *   zeta(s) = sum_{n<N} n^-s + N^(1-s)/(s-1) + N^-s/2
 *             + sum_{k=1..K} B_{2k}/(2k)! * s(s+1)...(s+2k-2) * N^(-s-2k+1)
 *
 * with N chosen from |t| and K = 10.  Accurate to ~1e-13 for 0.02 <= Re s <= 2
 * and |Im s| <= 300, which is checked against mpmath by verify_js.js.
 */

const B2K = [
  1 / 6,
  -1 / 30,
  1 / 42,
  -1 / 30,
  5 / 66,
  -691 / 2730,
  7 / 6,
  -3617 / 510,
  43867 / 798,
  -174611 / 330,
];

// factorials 2k! for k = 1..10
const F2K = [
  2, 24, 720, 40320, 3628800, 479001600, 87178291200, 20922789888000,
  6402373705728000, 2432902008176640000,
];

function cexp(re, im) {
  const m = Math.exp(re);
  return [m * Math.cos(im), m * Math.sin(im)];
}

/** n^{-s} for integer n >= 1 and s = sig + i t */
function npow(n, sig, t) {
  const L = Math.log(n);
  return cexp(-sig * L, -t * L);
}

/**
 * zeta(sig + i t). Returns [re, im].
 * The pole at s = 1 is skipped: we simply do not evaluate exactly there.
 */
function zeta(sig, t) {
  const N = Math.max(24, Math.ceil(Math.abs(t)) + 24);
  let re = 0;
  let im = 0;
  // sum_{n=1}^{N-1} n^-s
  for (let n = 1; n < N; n++) {
    const v = npow(n, sig, t);
    re += v[0];
    im += v[1];
  }
  // tail: N^(1-s)/(s-1) + N^-s/2
  const Nis = npow(N, sig, t); // N^-s
  // N^(1-s) = N * N^-s
  const Num = [N * Nis[0], N * Nis[1]];
  // divide by (s-1)
  const dr = sig - 1;
  const di = t;
  const den = dr * dr + di * di;
  re += (Num[0] * dr + Num[1] * di) / den;
  im += (Num[1] * dr - Num[0] * di) / den;
  re += 0.5 * Nis[0];
  im += 0.5 * Nis[1];

  // Bernoulli correction terms:
  //   term_k = B_2k/(2k)! * P_k * N^(-s-2k+1),  P_k = prod_{j=0}^{2k-2}(s+j)
  const lN = Math.log(N);
  const Ns = cexp(-sig * lN, -t * lN); // N^-s
  let pr = 1;
  let pi = 0;
  for (let k = 1; k <= 10; k++) {
    const j0 = k === 1 ? 0 : 2 * k - 3;
    const j1 = 2 * k - 2;
    for (let j = j0; j <= j1; j++) {
      const ar = sig + j;
      const nr = pr * ar - pi * t;
      const ni = pr * t + pi * ar;
      pr = nr;
      pi = ni;
    }
    const c = (B2K[k - 1] / F2K[k - 1]) * Math.pow(N, -2 * k + 1);
    re += c * (pr * Ns[0] - pi * Ns[1]);
    im += c * (pr * Ns[1] + pi * Ns[0]);
  }
  return [re, im];
}

/** |zeta(sig + i t)| */
function absZeta(sig, t) {
  const v = zeta(sig, t);
  return Math.hypot(v[0], v[1]);
}

/**
 * log Gamma(z) for z = re + i im, via the Stirling series after shifting
 * z -> z + N so that |z + N| is large enough for the series to converge fast.
 *
 *   log Gamma(z) = log Gamma(z+N) - sum_{k=0}^{N-1} log(z + k)
 *
 * The shift matters: at t = 0 the argument is 1/4, where raw Stirling is
 * garbage. With the shift the series is accurate to ~1e-13 for every t >= 0.
 */
function logGamma(re, im) {
  let N = 0;
  while (Math.hypot(re + N, im) < 14 && N < 200) N++;
  // subtract the shifted factors
  let subR = 0;
  let subI = 0;
  for (let k = 0; k < N; k++) {
    const ar = re + k;
    subR += 0.5 * Math.log(ar * ar + im * im);
    subI += Math.atan2(im, ar);
  }
  const zr = re + N;
  const zi = im;
  const r = Math.hypot(zr, zi);
  const th = Math.atan2(zi, zr);
  const lr = Math.log(r);
  // (z - 1/2) log z - z + 1/2 log(2 pi)
  const ar = zr - 0.5;
  let outR = ar * lr - zi * th - zr + 0.5 * Math.log(2 * Math.PI);
  let outI = ar * th + zi * lr - zi;
  // + 1/(12z) - 1/(360 z^3) + 1/(1260 z^5) - 1/(1680 z^7)
  const ir = zr / (r * r);
  const ii = -zi / (r * r);
  const p = (n) => {
    // z^-n by repeated multiplication
    let pr = 1;
    let pi = 0;
    for (let k = 0; k < n; k++) {
      const nr = pr * ir - pi * ii;
      const ni = pr * ii + pi * ir;
      pr = nr;
      pi = ni;
    }
    return [pr, pi];
  };
  const c = [1 / 12, -1 / 360, 1 / 1260, -1 / 1680];
  for (let i = 0; i < c.length; i++) {
    const q = p(2 * i + 1);
    outR += c[i] * q[0];
    outI += c[i] * q[1];
  }
  return [outR - subR, outI - subI];
}

/** Riemann-Siegel theta: arg of Gamma(1/4 + i t/2) - (t/2) log pi */
function siegelTheta(t) {
  return logGamma(0.25, t / 2)[1] - (t / 2) * Math.log(Math.PI);
}

/** Riemann-Siegel Z function: Z(t) = Re(e^{i theta(t)} zeta(1/2+it)), real. */
function Z(t) {
  const th = siegelTheta(t);
  const v = zeta(0.5, t);
  return v[0] * Math.cos(th) - v[1] * Math.sin(th);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { zeta, absZeta, Z, siegelTheta };
}
