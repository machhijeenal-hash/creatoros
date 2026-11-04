# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`

**Backend** (run from `src/backend/`):

- **install**: `mops install`
- **typecheck**: `mops check --fix`
- **build**: `mops build`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Learnings

- `research/riemann/` is a standalone maths study, not part of the product. The pnpm
  workspace only globs `src/**/*`, so nothing there touches install/typecheck/build.
  Its interactive page is generated with `python3 research/riemann/build_page.py`.
- The sandbox Python has no numpy/mpmath by default and is PEP-668 managed:
  `pip install --break-system-packages mpmath` works, plain `pip install` is refused.
- Node treats `.js` files in this repo as ES modules (`"type": "module"`), so a CJS
  script needs to be loaded via `new Function(fs.readFileSync(...))` in a test harness.
