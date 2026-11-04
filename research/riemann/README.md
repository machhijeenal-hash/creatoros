# An honest attempt at the Riemann Hypothesis

**Verdict: not solved, not disproved, no new idea.** The hypothesis is open and this
directory does not change that. What it does contain is the part of "trying" that is
actually available to a computer: four experiments that can be run and checked, the
numbers they produced, and a precise account of where each standard proof strategy
breaks. Nothing here is a proof, and the text says so every time it would be possible
to misread it.

Open `riemann.html` in a browser for the interactive version.

---

## The statement

For `Re s > 1`, `ζ(s) = Σ n⁻ˢ`. It continues to a meromorphic function on ℂ with a single
pole at `s = 1`, and the completed function `ξ(s) = ½ s(s−1) π^(−s/2) Γ(s/2) ζ(s)`
satisfies `ξ(s) = ξ(1−s)`.

So the picture is symmetric about `Re s = ½`. The trivial zeros sit at `s = −2, −4, −6, …`.
Everything else lives in the **critical strip** `0 < Re s < 1`, and Riemann's guess —
still unproved after 167 years — is that all of them lie on the middle line:

> Every nontrivial zero `ρ` of ζ satisfies `Re ρ = ½`.

The first zero is `ρ₁ = ½ + 14.134725141734693790… i`.

---

## What was actually done

Everything below is reproducible with `python3 zeta_lab.py` (25-digit arithmetic,
mpmath). Raw output is in `data.json`.

### E1 — locate and re-verify 100 zeros

`mpmath.zetazero(n)` finds each zero; independence is added by re-evaluating the
Riemann–Siegel function `Z(t) = e^{iθ(t)} ζ(½ + it)`, which is real for real `t`.

| quantity | value |
|---|---|
| zeros located | 100 |
| max \|Z(γₙ)\| at those zeros | 5.66 × 10⁻¹⁴ |
| max \|ζ(½ + iγₙ)\| | 2.57 × 10⁻¹³ |
| γ₁ | 14.134725141734695 |

### E2 — count the zeros twice (this is the real method)

Counting **only on the line** (sign changes of `Z`) is not enough: a zero could be hiding
elsewhere in the strip. So count **the whole strip** as well, by the argument principle on
the rectangle `[−1.5, 2] × [0.5, T]`. That rectangle contains no poles of ζ (the only
pole, `s = 1`, has imaginary part 0) and no trivial zeros (they lie at `−2, −4, …`), so
its winding number *is* the number of nontrivial zeros with `0 < Im s < T`.

| T | zeros on σ = ½ (sign changes of Z) | zeros in the strip (winding number) | agree |
|---|---|---|---|
| 50 | 10 | 10.0062 → **10** | ✓ |
| 100 | 29 | 29.0062 → **29** | ✓ |
| 150 | 52 | 52.0062 → **52** | ✓ |

The excess `0.0062` is pure discretisation of the contour (720 steps); rounding is
legitimate because a winding number is an integer. If the two counts ever disagreed, a
zero would be off the line.

This is exactly how the published verifications work — van de Lune–te Riele–Winter
(1986) and Gourdon (2004, first 10¹³ zeros) — with interval arithmetic in place of
floating point and Turing's method in place of the contour walk. This version is the
toy-sized cousin: it demonstrates the mechanism and extends the frontier by zero zeros.

### E3 — hunt for a counterexample at each ordinate

If a zero were off the line, then at its ordinate `t` the function `|ζ(σ + it)|` would
dip to zero somewhere other than `σ = ½`. So sweep `σ ∈ (0, 1)` at every known ordinate
and minimise.

| quantity | value (40 zeros) |
|---|---|
| max \|arg min σ − ½\| | 6.7 × 10⁻¹⁶ |
| deepest \|ζ\| on the line | 2.2 × 10⁻¹⁴ |
| typical \|ζ\| ten hundredths off the line | 0.19 |
| median contrast | ≈ 3.4 × 10¹³ |

Every minimum lands on `σ = ½`, and the function rises by thirteen orders of magnitude
within `0.1` of the line. This is a *local* check: it confirms the zeros that exist, and
says nothing about ordinates nobody has looked at — of which there are infinitely many.

### E4 — why anyone cares: the explicit formula

```
ψ(x) = x − Σ_ρ x^ρ/ρ − log 2π − ½ log(1 − x⁻²)
```

`ψ` is the exact Chebyshev function `Σ_{pᵏ ≤ x} log p`, computed here from a sieve with
no reference to ζ. The sum runs over the zeros. Truncating it after K zeros and comparing:

| zeros K | rms error | max error |
|---|---|---|
| 1 | 2.300 | 7.073 |
| 5 | 1.772 | 5.651 |
| 25 | 1.183 | 3.491 |
| 50 | 0.859 | 2.967 |
| 100 | 0.581 | 2.478 |

(evaluated for `10 ≤ x ≤ 300`, excluding prime powers where ψ jumps)

Each zero `ρ = ½ + iγ` contributes a wave `x^½ cos(γ log x)/|ρ|`. **That is the whole
argument for RH**: a zero with `Re ρ = ½ + δ` would contribute a term growing like
`x^½⁺δ`, and the primes would visibly drift off the line `x`. Every zero found so far
sits exactly on the knife edge `δ = 0`.

---

## Why none of this is a proof

A proof must cover all zeros. A computation covers the first N. For any N there are
infinitely many ordinates beyond it, and RH quantifies over every one of them. That is
not a technicality; it is why 167 years of Moore's law has not closed the problem.

| route | what it does | why it fails |
|---|---|---|
| **Brute force** | the first handful of zeros (Gram, 1903) → 10¹³ zeros (Gourdon, 2004), all on the line | 10¹³ is 0% of infinity; a counterexample at 10¹⁴ is compatible with all of it |
| **Positivity** | RH ⇔ Li's criterion `λₙ ≥ 0 ∀n`; equivalently a quadratic form is positive semidefinite | positivity must hold on an infinite-dimensional space; every finite truncation ever tested is positive — including for hypotheses that are false (this is where de Branges' attempts died) |
| **Elementary reformulation** | Mertens' `\|M(x)\| ≤ √x` implies RH | it is *false* (Odlyzko–te Riele, 1985); RH needs the weaker `M(x) = O(x^½⁺ε)`, and no elementary argument reaches it. Lesson: a pattern confirmed for millions of x was wrong |
| **Zero density** | bound `N(σ, T)`, the number of zeros with `Re ρ ≥ σ`: Ingham (1940), Guth–Maynard (2024) | any bound of the form `T^{c(1−σ)}` still *permits* zeros off the line; it raises the proven on-line proportion, never to 100% |
| **Spectral (Hilbert–Pólya)** | if the zeros are eigenvalues of a self-adjoint operator, they are automatically real, i.e. on the line | nobody has produced the operator; GUE gap statistics are evidence for the analogy, not a construction |

What *would* count: a positivity theorem in infinitely many dimensions, an exact
evaluation of a sum over all zeros, or something nobody has thought of. What would not
count: more zeros, a longer computation, a model that fits the zeros, or this page.

---

## Where the problem stands (as of late 2026)

- **1896** Hadamard and de la Vallée Poussin: no zeros on `Re s = 1` → the Prime Number
  Theorem.
- **1914** Hardy: infinitely many zeros on the line.
- **1942** Selberg: a positive proportion of zeros on the line.
- **1974** Levinson: at least ⅓. **1989** Conrey: more than 2/5 (40%).
- **2004** Gourdon: the first 10¹³ zeros verified — all on the line.
- **2011→** refinements push the proven proportion to ≈ 41.6%.
- **2018** Rodgers–Tao prove the Newman conjecture (`Λ ≥ 0`): if RH is true, the zeros are
  only *barely* on the line.
- **2024** Guth–Maynard break Ingham's 84-year-old zero-density bound using decoupling:
  `N(σ,T) ≤ T^{(30/13)(1−σ)+o(1)}`. A genuine breakthrough, explicitly *not* a step toward
  a proof.
- **2026** a research model at Anthropic reports raising the proven on-line proportion
  from 41.6% to 67.25%, by combining pair-correlation results (Baluyot–Goldston–Suriajaya–
  Turnage-Butterbaugh) with Bombieri's 2000 work; checked by Conrey and Goldston and
  formalised in Lean. Still a density/pair-correlation argument — the same structural wall,
  and its authors say there is no path from it to the hypothesis.

Sources: [Guth–Maynard, *Large values of Dirichlet polynomials and zero density
estimates*](https://arxiv.org/abs/2405.20552) ·
[Scientific American on Guth–Maynard](https://www.scientificamerican.com/article/the-riemann-hypothesis-the-biggest-problem-in-mathematics-is-a-step-closer/) ·
[Anthropic research note on the 2026 lower bound](https://www.anthropic.com/research/riemann-zeta) ·
[Quanta](https://www.quantamagazine.org/).

---

## Files

| file | what it is |
|---|---|
| `zeta_lab.py` | the four experiments; writes `data.json` (~110 s, needs `mpmath`) |
| `data.json` | every raw number on the page |
| `zeta.js` | ζ in the browser by Euler–Maclaurin summation, plus `Z(t)` and `θ(t)` |
| `verify_js.js` | cross-checks the JavaScript against mpmath (`node verify_js.js`) |
| `test_page.js` | headless smoke test of the page's DOM/canvas logic (`node test_page.js`) |
| `page.template.html` | the page source, with data and ζ inlined at build time |
| `build_page.py` | inlines `zeta.js` + `data.json` into a single `riemann.html` |
| `riemann.html` | the deliverable — self-contained, no network needed |

```bash
pip install mpmath
python3 zeta_lab.py      # ~110 s → data.json
python3 build_page.py    # → riemann.html
node verify_js.js        # JS zeta vs mpmath: 2.8e-13
node test_page.js        # page logic smoke test
```

## Limitations, stated plainly

- Everything is floating point. Certified verification needs interval arithmetic; this
  does not have it, so nothing here is a rigorous statement about a zero-free region.
- Ranges are tiny: `t ≤ 150` for the counts, 100 zeros, 40 ordinates for the hunt. The
  published frontier is 10¹³ zeros; this is not a contribution to it.
- The page's JavaScript agrees with mpmath to ≈ 3 × 10⁻¹³ — enough for pictures, not for
  claims.
- `Z(t)`, `θ(t)` and `ζ(s)` implementations are the standard Euler–Maclaurin and Stirling
  expansions; they are cross-checked against mpmath on 40 reference points, nothing more.
