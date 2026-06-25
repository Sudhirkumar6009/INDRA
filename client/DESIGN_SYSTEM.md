# INDRA UI Design System

## Design Philosophy

Clean, elegant, and professional design inspired by Indian flag colors without any gradients.

## Color Palette

### Primary Colors (Indian Flag)
- **Saffron/Orange**: `#FF9933` - Primary actions, highlights
- **White**: `#FFFFFF` - Background, cards
- **Green**: `#138808` - Secondary actions, success states

### Supporting Colors
- **Gray Scale**: For text and borders
  - Gray 900: `#1f2937` (Primary text)
  - Gray 600: `#6b7280` (Secondary text)
  - Gray 200: `#e5e7eb` (Borders)
  - Gray 50: `#f9fafb` (Backgrounds)

## Typography

- **Headings**: Plus Jakarta Sans (Bold, 700-900)
- **Body**: Inter (Regular, 400-600)

## Component Design

### Logo
- Text-based: **IND** (saffron) + **RA** (green)
- No icon required
- Large and prominent

### Navigation Bar
- Clean white background with subtle backdrop blur
- Minimal border bottom
- Hover effects: smooth color transitions
- Active state: saffron color

### Buttons
- **Primary**: Saffron background, white text
- **Secondary**: Green background, white text
- **Outline**: Border with saffron/green, transparent background
- **Hover**: Slight opacity change + shadow elevation

### Cards
- White background
- Subtle border (gray-200)
- Hover: border color changes to saffron/green
- Shadow on hover

### Stats Cards
- Icon in saffron/green
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
- Links: color change (gray → saffron)
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

**Result**: Modern, clean, and elegant design that reflects Indian identity through colors while maintaining professional standards.
