#!/usr/bin/env python3
"""
zeta_lab.py -- a computational study of the Riemann Hypothesis.

What this script does (and does NOT do)
--------------------------------------
It does NOT prove the Riemann Hypothesis. Nobody has. What it does is the one
thing that is actually within reach of a laptop: it *tests* RH hard in a
rigorous-in-spirit way and it *demonstrates* the mechanism that makes RH
interesting (zeros of zeta <-> distribution of primes).

The four experiments
--------------------
  E1  Locate the first 40 nontrivial zeros on the critical line, and verify
      independently (via the Riemann-Siegel Z function) that they are zeros.

  E2  The "no hidden zeros" check. Counting zeros by the argument principle
      (Riemann-von Mangoldt N(T) = theta(T)/pi + 1 + S(T)) and comparing with
      the number of sign changes of Z(t) on the critical line. If the two
      counts agree, every zero below T is on the line. This is the mechanism of
      the big supercomputer verifications (van de Lune, Gourdon, ...).

  E3  A counterexample hunt at each known zero: sweep sigma in (0,1) and
      minimise |zeta(sigma + i gamma_n)|. RH predicts the unique minimum sits
      at sigma = 1/2. We measure where it actually sits and how deep it is.

  E4  The explicit formula: psi(x) = x - sum_rho x^rho/rho - log(2 pi) - ..., the
      exact identity that turns "where the zeros are" into "how the primes are
      distributed". Truncating the zero sum and watching the prime-counting
      error materialise is the reason anyone cares.

Dependencies: mpmath only (pip install mpmath).
"""

from __future__ import annotations

import json
import math
import time
from pathlib import Path

import mpmath as mp

mp.mp.dps = 20

HERE = Path(__file__).resolve().parent
DATA = HERE / "data.json"


# ----------------------------------------------------------------------------
# helpers
# ----------------------------------------------------------------------------
def zeta_mod(sigma: float, t: float) -> float:
    """|zeta(sigma + i t)|"""
    return abs(mp.zeta(mp.mpc(sigma, t)))


def golden_min(f, a: float, b: float, iters: int = 60):
    """Golden-section search for the minimum of a unimodal f on [a, b]."""
    gr = (math.sqrt(5.0) - 1.0) / 2.0
    c = b - gr * (b - a)
    d = a + gr * (b - a)
    fc, fd = f(c), f(d)
    for _ in range(iters):
        if fc < fd:
            b, d, fd = d, c, fc
            c = b - gr * (b - a)
            fc = f(c)
        else:
            a, c, fc = c, d, fd
            d = a + gr * (b - a)
            fd = f(d)
    x = (a + b) / 2.0
    return x, f(x)


def psi_table(xmax: int):
    """Chebyshev psi(x) = sum_{p^k <= x} log p, for integer x up to xmax."""
    sieve = bytearray([1]) * (xmax + 1)
    sieve[0:2] = b"\x00\x00"
    for i in range(2, int(xmax**0.5) + 1):
        if sieve[i]:
            sieve[i * i :: i] = bytearray(len(sieve[i * i :: i]))
    psi = [0.0] * (xmax + 1)
    for p in range(2, xmax + 1):
        if sieve[p]:
            lp = math.log(p)
            q = p
            while q <= xmax:
                psi[q] += lp
                q *= p
    running = 0.0
    out = [0.0] * (xmax + 1)
    for n in range(xmax + 1):
        running += psi[n]
        out[n] = running
    return out


# ----------------------------------------------------------------------------
# E1 / E2 / E3
# ----------------------------------------------------------------------------
def experiment_zeros(nmax: int = 40):
    zeros = []
    for n in range(1, nmax + 1):
        rho = mp.zetazero(n)
        gamma = float(mp.im(rho))
        # independent check with the Riemann-Siegel Z function
        z_val = float(mp.siegelz(gamma))
        theta = float(mp.siegeltheta(gamma))
        # zeta(1/2+it) = e^{-i theta} Z(t), so |zeta| must equal |Z|
        absz = float(abs(mp.zeta(mp.mpc(0.5, gamma))))
        zeros.append(
            {
                "n": n,
                "gamma": gamma,
                "Z": z_val,
                "abs_zeta": absz,
                "theta": theta,
                "gap": None,
            }
        )
    for i in range(1, len(zeros)):
        zeros[i]["gap"] = zeros[i]["gamma"] - zeros[i - 1]["gamma"]
    return zeros


def count_check(T: float, dt: float = 0.02):
    r"""
    Count nontrivial zeros with 0 < Im(s) < T two independent ways.

    (a) On the line: every sign change of the Riemann-Siegel function
        Z(t) = e^{i theta(t)} zeta(1/2 + it)  (Z is real for real t) is a zero of
        zeta on the critical line.

    (b) Everywhere in the strip: the argument principle on the rectangle
        [-1.5, 2] x [0.5, T].  That rectangle contains no poles of zeta (the only
        pole is s = 1, whose imaginary part 0 is below the rectangle) and no
        trivial zeros (they sit at -2, -4, ... < -1.5), so the winding number
        of zeta around the boundary *is* the number of zeros in the strip below T.

    If (a) == (b), then no zero below T can be hiding off the critical line.
    This -- applied with interval arithmetic -- is exactly how the published
    verifications reach 10^13 zeros.
    """
    # (a) sign changes of Z
    def Z(t):
        return float(mp.siegelz(t))

    prev_t, prev = 0.5, Z(0.5)
    on_line = []
    t = prev_t
    while t < T:
        t = min(t + 0.02, T)
        cur = Z(t)
        if (prev < 0 < cur) or (prev > 0 > cur):
            lo, hi, flo = prev_t, t, prev
            for _ in range(90):
                mid = 0.5 * (lo + hi)
                fm = Z(mid)
                if (flo < 0) == (fm < 0):
                    lo, flo = mid, fm
                else:
                    hi = mid
            on_line.append(0.5 * (lo + hi))
        prev, prev_t = cur, t

    # (b) argument principle on the rectangle
    s0, s1, t0 = -1.5, 2.0, 0.5
    pts = []
    n = int(round((s1 - s0) / dt))
    pts += [mp.mpc(s0 + (s1 - s0) * i / n, t0) for i in range(n + 1)]
    n = int(round((T - t0) / dt))
    pts += [mp.mpc(s1, t0 + (T - t0) * i / n) for i in range(1, n + 1)]
    n = int(round((s1 - s0) / dt))
    pts += [mp.mpc(s1 - (s1 - s0) * i / n, T) for i in range(1, n + 1)]
    n = int(round((T - t0) / dt))
    pts += [mp.mpc(s0, T - (T - t0) * i / n) for i in range(1, n)]
    tot = mp.mpf(0)
    prev_v = None
    for p in pts:
        v = mp.zeta(p)
        if prev_v is not None and v != 0 and prev_v != 0:
            tot += mp.arg(v / prev_v)
        prev_v = v
    winding = float(tot / (2 * mp.pi))

    return {
        "T": T,
        "on_line_zeros": len(on_line),
        "strip_zeros_winding": winding,
        "strip_zeros": round(winding),
        "residue": winding - round(winding),
        "match": round(winding) == len(on_line),
        "first_bracket": on_line[:3],
        "last_bracket": on_line[-2:],
    }


def off_line_hunt(zeros, band=0.48):
    """Sweep sigma in (0,1) at each zero ordinate and find the true minimum."""
    out = []
    for z in zeros:
        g = z["gamma"]
        f = lambda s: zeta_mod(s, g)
        s_min, v_min = golden_min(f, 0.02, 0.98, iters=70)
        v_center = zeta_mod(0.5, g)
        # how much bigger is |zeta| a little way off the line?
        left = zeta_mod(max(0.02, 0.5 - 0.1), g)
        right = zeta_mod(min(0.98, 0.5 + 0.1), g)
        # "peak" height of |zeta| inside the strip at this ordinate
        peak = max(zeta_mod(s, g) for s in (0.02, 0.05, 0.1, 0.9, 0.95, 0.98))
        out.append(
            {
                "n": z["n"],
                "gamma": g,
                "sigma_min": s_min,
                "abs_zeta_min": v_min,
                "abs_zeta_on_line": v_center,
                "abs_zeta_off_10": 0.5 * (left + right),
                "sigma_gap": s_min - 0.5,
                "peak": peak,
            }
        )
    return out


# ----------------------------------------------------------------------------
# E4 explicit formula
# ----------------------------------------------------------------------------
def explicit_formula(zeros, xmax=300):
    r"""
        psi(x) = x - sum_rho x^rho/rho - log(2 pi) - (1/2) log(1 - x^-2)

    Truncating the sum over zeros and comparing with the true psi(x) (computed
    exactly from a sieve) shows how the primes are literally built out of the
    zeros.  The size of the leftover error is governed by Re(rho): if every
    rho has Re(rho) = 1/2 the error is O(x^{1/2} log^2 x), which is RH.
    """
    psi = psi_table(xmax)

    def is_prime_power(n):
        if n < 2:
            return False
        for p in range(2, int(n**0.5) + 1):
            if n % p == 0:
                m = n
                while m % p == 0:
                    m //= p
                return m == 1
        return True

    gammas = [z["gamma"] for z in zeros]
    # evaluate off the jump points of psi, where the series converges to the mean
    xs = [x for x in range(10, xmax + 1) if not is_prime_power(x)]
    results = []
    for K in (1, 5, 25, 50, 100):
        if K > len(gammas):
            continue
        errs = []
        for x in xs:
            main = x - math.log(2 * math.pi) - 0.5 * math.log(1 - 1.0 / (x * x))
            s = 0.0
            for g in gammas[:K]:
                rho = complex(0.5, g)
                s += 2 * (x**rho / rho).real
            errs.append(psi[x] - (main - s))
        rms = math.sqrt(sum(e * e for e in errs) / len(errs))
        results.append({"K": K, "rms_error": rms, "max_error": max(abs(e) for e in errs)})

    K = min(100, len(gammas))
    curve = []
    for x in range(10, xmax + 1):
        main = x - math.log(2 * math.pi) - 0.5 * math.log(1 - 1.0 / (x * x))
        s = 0.0
        for g in gammas[:K]:
            rho = complex(0.5, g)
            s += 2 * (x**rho / rho).real
        curve.append({"x": x, "psi": psi[x], "explicit": main - s})
    return results, curve


# ----------------------------------------------------------------------------
def main():
    t0 = time.time()
    print("[E1] locating zeros ...")
    zeros = experiment_zeros(100)
    print(f"     first zero gamma_1 = {zeros[0]['gamma']:.15f}")
    print(f"     max |Z(gamma_n)| = {max(abs(z['Z']) for z in zeros):.3e}")

    print("[E2] counting zeros below T (argument principle vs Z sign changes) ...")
    counts = [count_check(T) for T in (50.0, 100.0, 150.0)]
    for c in counts:
        print(
            f"     T={c['T']:5.0f}  on-line zeros={c['on_line_zeros']:3d}   "
            f"strip zeros={c['strip_zeros_winding']:.4f} -> {c['strip_zeros']}  match={c['match']}"
        )

    print("[E3] hunting for off-line zeros at each ordinate ...")
    hunt = off_line_hunt(zeros[:40])
    worst = max(abs(h["sigma_gap"]) for h in hunt)
    print(f"     max |sigma_min - 1/2| = {worst:.4f}")
    print(f"     max |zeta(gamma_n)| on the line = {max(h['abs_zeta_on_line'] for h in hunt):.3e}")

    print("[E4] explicit formula ...")
    ef, curve = explicit_formula(zeros)
    for r in ef:
        print(f"     K={r['K']:3d} zeros -> rms error {r['rms_error']:.4f}  max {r['max_error']:.3f}")

    # reference values of zeta, used to validate the JavaScript implementation
    # that powers the interactive page (see verify_js.js)
    print("[E5] writing reference values for the JS port ...")
    ref = []
    for i in range(40):
        sig = mp.mpf(0.02) + mp.mpf(0.96) * ((i * 37) % 40) / 39
        tt = mp.mpf(137.0) * ((i * 23) % 40) / 39
        v = mp.zeta(mp.mpc(sig, tt))
        # full precision as strings: the JS port is checked against these
        ref.append(
            {
                "s": mp.nstr(sig, 25),
                "t": mp.nstr(tt, 25),
                "re": mp.nstr(mp.re(v), 25),
                "im": mp.nstr(mp.im(v), 25),
                "abs": mp.nstr(abs(v), 25),
            }
        )

    theta_ref = []
    for tt in (0.0, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 40.0, 80.0, 140.0):
        theta_ref.append(
            {
                "t": mp.nstr(mp.mpf(tt), 20),
                "theta": mp.nstr(mp.siegeltheta(mp.mpf(tt)), 25),
            }
        )

    payload = {
        "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "theta_ref": theta_ref,
        "reference": ref,
        "dps": mp.mp.dps,
        "runtime_s": round(time.time() - t0, 2),
        "zeros": zeros,
        "counts": counts,
        "off_line": hunt,
        "explicit_formula": ef,
        "explicit_curve": curve,
    }
    DATA.write_text(json.dumps(payload, indent=1, default=float))
    print(f"\nwrote {DATA} in {payload['runtime_s']}s")


if __name__ == "__main__":
    main()
