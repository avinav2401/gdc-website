# GDC Website Design System & Styling Rules

When building or modifying components in this repository, you MUST adhere to the following design system and styling rules. This project uses a distinct "comic/arcade" visual language.

## 1. Tailwind CSS v4 Configuration
This project uses **Tailwind CSS v4**. There is no `tailwind.config.ts`. All theme configurations are done via the `@theme` block in `app/globals.css`. 
Do not attempt to modify or look for a tailwind config file.

## 2. Color Palette
Stick to the following semantic colors (defined in CSS variables):
- **Backgrounds**: `var(--paper)` / `var(--bg)` (main background), `var(--card)` (card background).
- **Accents**: 
  - `var(--primary)` / `var(--blue)` / `var(--color-blue)`
  - `var(--secondary)` / `var(--red)` / `var(--color-red)`
  - `var(--comic-yellow)` / `var(--yellow)` / `var(--color-yellow)`
- **Inks**: `var(--ink)` (pitch black) and `var(--white)`.

## 3. Typography
- **Headings (h1-h6)**: Use `font-display` (mapped to `font-arcade` / "Press Start 2P"). These should almost always be `uppercase` and use `tracking-wider`.
- **Body**: Use `font-body` ("Pixelify Sans").
- **Crisp Pixel Rendering**: Apply the `.pixel-antialiased` utility class to pixel-art text and `.pixel-image` to pixel-art images to prevent browser blurring.

## 4. UI Components & Borders
Instead of standard Tailwind shadows and borders, use the custom "comic" classes defined in `app/globals.css` to achieve the hard-edged retro aesthetic:
- **Borders**: `.comic-border` or `.ink-border` (thick white border), `.ink-border-black`.
- **Shadows (Hard Offset)**: `.comic-shadow`, `.ink-shadow`, `.ink-shadow-red`, `.ink-shadow-blue`. These give the 3D retro feel.
- **Hover Effects**: Apply `.comic-hover` or `.ink-hover` to interactive elements. This creates a tactile "press" effect where the element translates down and the shadow shrinks.
  - Example: `className="comic-border comic-shadow-sm comic-hover active:comic-shadow-none"`

## 5. Textures
Use these utility classes for backgrounds to create a comic-book print feel:
- `.dots-yellow`, `.dots-blue`, `.dots-red`, `.dots-white` (Ben-Day halftone dots).
- `.hatch`, `.hatch-bold`, `.crosshatch` (Diagonal hatching lines).

## 6. Implementation Notes
- When creating buttons, always try to use or extend the existing `ComicButton` component (`components/ui/ComicButton.tsx`).
- Card components should use the dark background (`bg-[#111118]` or `var(--card)`) with appropriate comic borders.
- **DO NOT** use standard soft Tailwind shadows like `shadow-md` or `shadow-lg`. Always use the hard offset shadows (`comic-shadow`).
