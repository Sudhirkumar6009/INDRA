# INDRA UI Design System

## Design Philosophy

Clean, elegant, and professional design using only GREEN and its shades — no gradients, no other colors.

## Color Palette

### Green Scale (Primary Palette)
- **Green 50**: `#f0fdf4` - Light backgrounds (light mode)
- **Green 100**: `#dcfce7` - Muted backgrounds, hover states
- **Green 200**: `#bbf7d0` - Borders (light mode)
- **Green 300**: `#86efac` - Subtle borders, light elements
- **Green 400**: `#4ade80` - Muted text, secondary icons (dark mode)
- **Green 500**: `#22c55e` - Focus rings, hover borders
- **Green 600**: `#16a34a` - Primary brand (IND), primary buttons, links
- **Green 700**: `#15803d` - Secondary brand (RA), secondary text (light)
- **Green 800**: `#166534` - Cards, borders (dark mode)
- **Green 900**: `#14532d` - Main text (light), card backgrounds (dark)
- **Green 950**: `#052e16` - Main background (dark mode), replaces black

### Color Mapping

#### Light Mode
| Role | Color |
|------|-------|
| Page background | green-50 |
| Card background | White |
| Primary text | green-900 |
| Secondary text | green-700 |
| Muted text | green-500 |
| Borders | green-200 |
| Input borders | green-300 |
| Focus ring | green-500 |
| Primary buttons | green-600 bg, white text |
| Secondary buttons | green-700 bg, white text |

#### Dark Mode
| Role | Color |
|------|-------|
| Page background | green-950 |
| Card background | green-900 |
| Primary text | green-50 |
| Secondary text | green-300 |
| Muted text | green-400 |
| Borders | green-800 |
| Input borders | green-700 |
| Focus ring | green-500 |
| Primary buttons | green-600 bg, white text |
| Secondary buttons | green-700 bg, white text |

### Brand / Logo
- **IND**: green-600
- **RA**: green-700

### Semantic / Data Colors (all green shades)
- Highest intensity: green-800
- High intensity: green-700
- Medium intensity: green-600
- Low-medium intensity: green-500
- Low intensity: green-400

### Severity Alert Colors
- **Low**: green-100 bg, green-700 text, green-300 border
- **Medium**: green-200 bg, green-800 text, green-400 border
- **High**: green-300 bg, green-900 text, green-500 border
- **Critical**: green-400 bg, green-950 text, green-600 border

### Trend Indicators
- **Positive/Up**: green-600 (brighter = good)
- **Negative/Down**: green-800 (darker = alarming)

## Typography

- **Headings**: Space Grotesk (Bold, 700)
- **Body**: Space Grotesk (Regular, 400-600)

## Component Design

### Logo
- Text-based: **IND** (green-600) + **RA** (green-700)
- No icon required
- Large and prominent

### Navigation Bar
- White/green-950 background with subtle backdrop blur
- Minimal border bottom (green-100 light / green-900 dark)
- Hover effects: smooth color transitions
- Active state: green-600

### Buttons
- **Primary**: Green-600 background, white text
- **Secondary**: Green-700 background, white text
- **Outline**: Border with green-600, transparent background
- **Destructive**: Green-700/800 background
- **Hover**: Slight opacity change + shadow elevation

### Cards
- White (light) / green-900 (dark) background
- Subtle border (green-200 light / green-800 dark)
- Hover: border color changes to green-500
- Shadow on hover

### Stats Cards
- Icon in green-600
- Large bold numbers
- Clean typography
- Hover: scale animation (1.02x)

## Animation Principles

### Motion
- Framer Motion for all animations
- Smooth entrance: fade + slide up
- Hover: subtle scale (1.02-1.05x)
- Page transitions: fade in/out

### Timing
- Default duration: 0.3-0.6s
- Delays: staggered (0.1-0.2s increments)
- Easing: ease-out

## Layout

### Spacing
- Container max-width: 7xl (1280px)
- Section padding: py-20
- Component padding: p-6
- Gap between elements: 4-8

### Grid
- Stats: 2 cols mobile, 4 cols desktop
- Features: 1 col mobile, 3 cols desktop
- Datasets: 2 cols mobile, 4 cols desktop

## Hover Effects

All interactive elements have hover states:
- Links: color change (green-700 → green-600)
- Buttons: opacity + shadow
- Cards: border color + shadow elevation
- Icons: color change

## No Gradients Policy

- All backgrounds: solid colors
- All buttons: solid colors
- All overlays: solid colors with opacity if needed
- Clean and professional aesthetic

## Accessibility

- High contrast ratios
- Clear focus states
- Semantic HTML
- ARIA labels where needed

## Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Touch-friendly (44px minimum tap targets)
- Readable text sizes (16px minimum)

---

**Result**: Modern, clean, and elegant design using a monochromatic green palette. Dark green replaces black for dark mode, light green replaces white/gray for light mode, with shades used for semantic differentiation.
