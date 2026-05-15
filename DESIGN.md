# CreatorOS Design System

## Visual Direction
Dark futuristic premium AI SaaS. Minimalist tech aesthetic inspired by Linear, Stripe Dashboard, Arc Browser. Electric blue + purple glow accents on matte black. Glassmorphic depth, cinematic motion, editorial grid layouts. Genuinely premium—not generic AI templates.

## Tone & Differentiation
Confident, sophisticated, productive. Every pixel communicates premium quality. Emotional resonance through motion and depth (not skeuomorphism). Focus: clarity over decoration. Addictive productivity feel.

## Color Palette (OKLCH Dark Mode)
| Role | OKLCH | Usage |
|------|-------|-------|
| Background | 0.145 0 0 | Page base, lowest layer |
| Card/Elevated | 0.18 0 0 | Widget containers, modal backgrounds |
| Popover | 0.22 0 0 | Tooltips, dropdowns, panels |
| Foreground Text | 0.95 0 0 | Primary text, high contrast |
| Muted Text | 0.55 0 0 | Secondary labels, hints |
| Primary/Accent | 0.56 0.22 262 | Electric blue (#0084ff equivalent)—CTAs, active states, highlights |
| Secondary | 0.52 0.18 297 | Purple glow (#7c3aed equivalent)—secondary accents, borders |
| Border | 0.28 0 0 | Subtle dividers, card edges |
| Destructive | 0.65 0.19 22 | Error, delete, warning actions |

## Typography System
| Layer | Font | Scale | Usage |
|-------|------|-------|-------|
| Display | Space Grotesk | 48px–72px, 700 | Page titles, hero headlines |
| Body | Plus Jakarta Sans | 14px–16px, 400/500/600 | Content, labels, UI text |
| Mono | JetBrains Mono | 12px–14px, 400/500 | Code, tokens, timestamps |

## Elevation & Depth
- `.glass`: Card bg with 70% opacity + backdrop blur + 1px white/10 border
- `.glass-hover`: Hover state—bg opacity 85%, border white/20, smooth transition
- `.glow-accent`: Primary accent shadow (8px blue glow at 15% opacity)
- `.text-gradient`: Gradient text from primary to secondary (hero headlines)

## Structural Zones
| Zone | Treatment | Rationale |
|------|-----------|----------|
| Header | Glass card, elevated, sticky top | Command bar + logo—quick access |
| Sidebar | Matte card (0.18 OKLCH), 1px border | Navigation, persistent context |
| Main Content | Background base (0.145), grid layout | Spacious, clean, content-focused |
| Widgets | Glass cards, varied heights | Dashboard metrics, elevated visual hierarchy |
| Footer | Muted background, 1px top border | Attribution, secondary actions |

## Spacing & Rhythm
- Base unit: 4px grid
- Padding: 16px (content), 24px (sections), 32px (page margins)
- Gap: 16px (component rows), 24px (section blocks)
- Breathing room on dark mode—more whitespace than light themes

## Component Patterns
- **Buttons**: Primary (bg-primary), Secondary (border-primary/text-primary), Ghost (text-muted)
- **Cards**: Always .glass + rounded-lg, never flat backgrounds
- **Inputs**: bg-input/border-input, focus:ring-2 ring-primary
- **Badges**: Small pill containers, semantic colors (success, warning, destructive)
- **Modals**: Popover bg with card border, centered 80vw max

## Motion & Animation
- **Entrance**: fade-in (0.3s), fade-up (0.4s cubic), slide-in (0.3s)
- **Interaction**: hover transforms (scale 1.02–1.05), transition-smooth (0.3s cubic-bezier)
- **Loading**: pulse-glow (infinite 2s, electric blue + purple alternating)
- **Choreography**: Stagger child animations by 50–100ms for cascading effect
- **No bounce or elastic ease**—refined cubic-bezier(0.4, 0, 0.2, 1) throughout

## Key Constraints
- No raw hex or RGB colors—all semantic OKLCH tokens via CSS variables
- No gradients on components—only on hero text or as atmospheric accents
- No shadows beyond glow effects (primary/purple glow only)
- Rounded: lg (10px) for cards, md (8px) for inputs, sm (6px) for small elements
- Minimum contrast: AA+ in all states (text on bg, text on card, interactive elements)
- Mobile-first: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)

## Signature Details
- **Glassmorphic depth**: Every interactive surface uses `.glass` with glow-accent on hover
- **Electric blue pulse**: Primary accent glows under focus/hover (glow-sm/glow-md)
- **Purple secondary**: Strategic use on borders, badges, secondary CTAs—not dominant
- **Framer Motion orchestration**: Page transitions fade-in with staggered widget animations
- **Matte black foundation**: Background never goes to pure black—always 0.145 OKLCH for subtle texture
