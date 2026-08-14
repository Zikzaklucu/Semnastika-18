# Semnastika 18 WordPress Embed

This folder is a paste-ready export. The source files in the project root remain the development version and were not modified.

## Installation

1. **Log in as an Administrator.** This is required so the `<script>` tag in the Custom HTML block survives saving.
2. Go to **Appearance → Customize → Additional CSS**, paste the full contents of `wordpress-additional-css.css`, then publish the CSS.
3. Open the target page, add a **Custom HTML** block, paste the full contents of `wordpress-embed.html`, then publish the page.
4. Verify the published page: all four carousel systems work, dot indicators update, drag/swipe works, images load, the trailer video plays, every link works, and the **Daftar Sekarang** link opens correctly. Because Additional CSS is site-wide, also open a couple of unrelated pages and confirm their appearance has not changed.

## Important WordPress risks

### Inline scripts can be removed silently

WordPress KSES strips `<script>` tags from post content unless the saving account has the `unfiltered_html` capability. Full Administrators have it by default on a standard single-site install; Editors normally do not. After publishing, reopen the block editor and confirm the inline script still exists. If it was removed, the page will render but the carousels will not initialize; an Administrator must save the block or the script must be loaded through an administrator-controlled theme/plugin/custom-code mechanism.

### Confirm the page context with Jeki

The unresolved deployment choice is whether this bundle will be pasted into a **dedicated blank page** or inserted alongside existing WordPress content. A dedicated blank/full-width page is strongly recommended: the CSS is namespaced for either case, but the original design uses viewport-sized carousel geometry and a sticky site header, so a blank page has substantially lower integration risk. Confirm the intended target with Jeki before publishing.

### Scoped-container differences

The source page applied its background and smooth-scroll offset to the real `body`/`html`. In this export those rules apply only to `.semnastika-embed`, so the green texture fills the embedded experience but cannot style surrounding WordPress theme chrome. Viewport-level `html` smooth scrolling and `scroll-padding-top` also cannot be reproduced through safely scoped Additional CSS; the host theme controls those page-level behaviors.

The source skip link uses `position: absolute` inside `.semnastika-embed`, preventing it from attaching to the WordPress viewport and overlapping unrelated site content. The source's hidden bottom overscroll message is intentionally omitted from this export because transformed content below an embedded footer expands the WordPress page and exposes theme background. The Semnastika header remains `position: sticky`, which is container-safe on a blank/full-width page.

The Additional CSS also contains a narrowly targeted UGM TPB/Bootstrap host bridge. It activates only on a page containing `.semnastika-embed` and removes the page builder's `-15px` row margins, wrapper padding, and 30px bottom margin. Those host-theme rules otherwise create a 15px horizontal scrollbar and white space below the Semnastika footer even though the embed itself is correctly sized.

## Assets and caching

All local images and fonts used by the page now load from:

`https://cdn.jsdelivr.net/gh/Zikzaklucu/Semnastika-18@main/`

jsDelivr caches `@main` URLs aggressively. Changes pushed to GitHub can take up to roughly seven days to appear. If an updated asset does not show immediately, purge its CDN URL with <https://www.jsdelivr.com/tools/purge>.

No referenced file exceeds jsDelivr's approximate 20 MB per-file limit, so this bundle does not use `raw.githubusercontent.com` fallbacks.

## Files

- `wordpress-embed.html` — HTML plus strict, IIFE-wrapped inline JavaScript; no `<style>` block and no local script dependency.
- `wordpress-additional-css.css` — readable, namespaced CSS for the site-wide Additional CSS panel.
