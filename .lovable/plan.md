

## Live Typewriter Animation for VC Message

### What
Add a scroll-triggered typewriter effect to the VC message body. As the user scrolls the section into view, the text will appear character-by-character as if being written live, including the stats, pull quote, and all paragraphs.

### Approach
Create a reusable `TypewriterText` component that uses `useInView` from framer-motion to detect when the section enters the viewport, then reveals characters progressively using a `useState` counter driven by `setInterval`.

### Technical Details

**File: `src/components/VCMessageSection.tsx`**

1. **Split content into sequential blocks** — each paragraph, the stats row, and the pull quote become individual "segments" in an ordered array.

2. **TypewriterText component** — a small inline component that:
   - Uses `useRef` + `useInView` (framer-motion) to detect when the message body scrolls into view
   - Runs a `setInterval` (~15ms per character) that increments a character counter
   - Renders text with `text.slice(0, charIndex)` — characters beyond the index are transparent (not removed, to preserve layout stability)
   - Once a text block is fully revealed, the next block starts typing

3. **Sequencing logic**:
   - Block 1: First paragraph (with the drop-cap "E")
   - Block 2: Stats row (fades in as a unit after paragraph 1 finishes)
   - Block 3: Second paragraph
   - Block 4: Pull quote
   - Block 5: Third paragraph
   - Block 6: Fourth paragraph
   - Each block starts only after the previous one completes

4. **Implementation details**:
   - Use `useState` for `activeBlock` (which block is currently typing) and `charIndex` (current character position)
   - Text characters beyond `charIndex` get `opacity: 0` via a `<span>` wrapper to keep layout stable
   - Stats and pull quote use `motion.div` with `opacity` animated from 0→1 when their turn comes
   - The typing only triggers once (`once: true`) when the message body enters viewport
   - Speed: ~20ms per character for body text, instant reveal for stats

