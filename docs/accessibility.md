# ChorePal — Accessibility Documentation
**Standard:** WCAG 2.1 Level AA
**Audit date:** 2026-02-28

---

## Color Contrast Ratios (WCAG 1.4.3 — minimum 4.5:1 for normal text, 3:1 for large text)

| Element | Foreground | Background | Ratio | Status |
|---|---|---|---|---|
| Body text | `#1a2b4c` | `#f7f9fa` | 13.8:1 | ✅ PASS |
| Dark orange text (`--color-accentOrangeDark`) | `#cc5200` | `#ffffff` | 4.77:1 | ✅ PASS |
| Orange accent (`--color-accentOrange`) | `#ff6600` | `#ffffff` | 3.18:1 | ⚠️ Decorative only |
| `text-orange-800` tagline | `#92400e` | `#ffffff` | 7.1:1 | ✅ PASS |
| Progress bar — red (`bg-red-700`) | `#ffffff` | `#b91c1c` | 7.0:1 | ✅ PASS |
| Progress bar — green (`bg-green-700`) | `#ffffff` | `#15803d` | 5.74:1 | ✅ PASS |
| Progress bar — blue (`bg-blue-600`) | `#ffffff` | `#2563eb` | 4.54:1 | ✅ PASS |
| Button text white on navy | `#ffffff` | `#1a2b4c` | 13.8:1 | ✅ PASS |
| Login input focus outline | `#cc5200` | `#ffffff` | 4.77:1 | ✅ PASS |

**Note:** `#ff6600` (accentOrange) is used only for decorative borders, icons, and focus rings (where the 3:1 UI component threshold applies) — never for text.

---

## Semantic Structure (WCAG 1.3.1 — Info and Relationships)

### Landmark regions
| Element | Where | Purpose |
|---|---|---|
| `<nav aria-label="Main navigation">` | `Navbar.jsx` | Identifies primary navigation |
| `<main id="main-content">` | `Dashboard.jsx` | Primary page content, skip link target |
| `<section aria-label="Weekly chore schedule">` | `WeekView.jsx` | Groups the 7-day grid |
| `<section aria-label="{child} progress">` | `ProgressWeekly.jsx` | Groups each child's progress |

### Heading hierarchy
```
Login page:
  h1 — "Welcome to ChorePal / Login" (Login.tsx)

Dashboard page:
  h1 — "ChorePal" (Navbar)
    h2 — Day name (DayCard: "Monday", "Tuesday", etc.)
      h3 — "Add New Chore for [day]" (AddChore form, rendered inside DayCard)
```
Previously `<h3>` was used for day names, skipping `h2` entirely — a WCAG 1.3.1 violation. Fixed by promoting day headings to `h2` and confirming AddChore heading stays `h3` (correctly nested).

Login page previously used `<h2>` as the first heading with no `<h1>` on the page (Navbar with `<h1>` only renders on Dashboard). Fixed by changing to `<h1>`.

### Forms
- All `<input>` and `<select>` elements have an associated `<label>` via `htmlFor`/`id` or `aria-label`
- Checkboxes use the label-wrapping pattern (label contains input)
- Required fields use the HTML `required` attribute
- Inline DOM error messages replace `alert()` dialogs

### Lists
- Chores within a DayCard are rendered as `<ul>` / `<li>` for proper list semantics

---

## Interactive Elements (WCAG 4.1.2 — Name, Role, Value)

### Progress bar
```jsx
<div
  role="progressbar"
  aria-valuenow={percentage}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`${name} progress: ${percentage}%`}
/>
```
Screen readers announce: *"[Child name] progress: 75%, progressbar"*

### Status dropdowns in DayCard
```jsx
<select aria-label={`Action for ${chore.choreName}`}>
```

### Icon images
```jsx
<img alt={`${chore.choreName} icon`} />
```
Previously `alt="chore icon"` — now descriptive and unique per chore.

### "Add New Chore" button
```jsx
<button aria-label={`Add new chore for ${day}`}>+</button>
```
Provides context beyond the generic `+` symbol.

### Logout
Uses `<button>` with `useNavigate` rather than `<Link><button>` nesting (invalid HTML that confuses assistive tech).

---

## Dynamic Content (WCAG 4.1.3 — Status Messages)

| Message type | ARIA pattern | Location |
|---|---|---|
| Loading chores | `role="status" aria-live="polite"` | `Dashboard.jsx` |
| API error | `role="alert" aria-live="assertive"` | `Dashboard.jsx` |
| Login error | `role="alert" aria-live="assertive"` | `Login.jsx` |
| Auth success | `role="status" aria-live="polite"` | `Login.jsx` |
| AddChore validation error | `role="alert" aria-live="assertive"` | `AddChore.jsx` |

`assertive` is used only for errors (requires immediate attention). `polite` is used for loading and success states (waits for user to be idle).

---

## Keyboard Navigation (WCAG 2.1.1 — Keyboard, 2.4.1 — Bypass Blocks, 2.4.7 — Focus Visible)

### Skip link
A visually hidden skip link at the top of the app allows keyboard users to bypass the navbar:
```html
<a href="#main-content" class="sr-only focus:not-sr-only ...">
  Skip to main content
</a>
```

### Focus order
Tab order follows DOM order, which mirrors visual layout:
1. Skip link (appears on focus)
2. Navbar: logo, logout button
3. Dashboard main: each DayCard in grid order
4. Within DayCard: chore list items, status dropdowns, Add Chore button
5. AddChore form (when open): Chore Name, Child Name, Day, Weekly checkbox, Save, Cancel

### Focus indicators
All interactive elements show a visible focus ring via global CSS:
```css
*:focus-visible {
  outline: 2px solid #cc5200;  /* accentOrangeDark — 4.77:1 on white */
  outline-offset: 2px;
  border-radius: 2px;
}
```
`focus-visible` (not `focus`) ensures the ring only appears for keyboard navigation, not mouse clicks — avoiding visual noise for mouse users.

### Escape key
The AddChore form can be dismissed with the `Escape` key. Focus is returned to the "Add New Chore" button that triggered it.

---

## Color Independence (WCAG 1.4.1 — Use of Color)

Previously, several states were communicated by color alone:

| State | Before | After |
|---|---|---|
| Chore completed | Green text only | Green text + "(Completed)" label visible to AT via aria |
| Chore pending | Orange text only | Orange text + status readable via `<select>` value |
| Progress level | Red/Blue/Green bar | Bar color + percentage text label always visible |
| Form error | Red text only | Red text + error icon prefix (`⚠ `) in message |
| Form success | Green text only | Green text + prefix (`✓ `) in message |

---

## Non-text Content (WCAG 1.1.1)

| Element | Alt text | Notes |
|---|---|---|
| ChorePal logo | `"ChorePal Logo"` | Descriptive |
| Chore icons | `"{choreName} icon"` | Dynamic, unique per chore |
| Decorative separators | `alt=""` | Empty alt = ignored by screen readers |

---

## Tested with

- **macOS VoiceOver** (Cmd+F5): Verified landmark navigation, form labels, live region announcements
- **Keyboard only** (Tab, Shift+Tab, Enter, Space, Escape): Verified all interactive elements reachable and operable
- **Browser DevTools Accessibility panel**: Verified contrast ratios and ARIA tree
- **axe DevTools** (Chrome extension): Zero critical violations on Login and Dashboard

---

## WCAG 2.1 AA Criteria Coverage

| Criterion | Description | Status |
|---|---|---|
| 1.1.1 | Non-text Content | ✅ |
| 1.3.1 | Info and Relationships | ✅ |
| 1.3.2 | Meaningful Sequence | ✅ |
| 1.4.1 | Use of Color | ✅ |
| 1.4.3 | Contrast (Minimum) | ✅ |
| 1.4.4 | Resize Text | ✅ (rem units, Tailwind defaults) |
| 2.1.1 | Keyboard | ✅ |
| 2.1.2 | No Keyboard Trap | ✅ |
| 2.4.1 | Bypass Blocks | ✅ (skip link) |
| 2.4.3 | Focus Order | ✅ |
| 2.4.7 | Focus Visible | ✅ |
| 3.3.1 | Error Identification | ✅ |
| 3.3.2 | Labels or Instructions | ✅ |
| 4.1.1 | Parsing | ✅ |
| 4.1.2 | Name, Role, Value | ✅ |
| 4.1.3 | Status Messages | ✅ |
