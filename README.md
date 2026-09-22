[README.md](https://github.com/user-attachments/files/32537197/README.md)
# Yusif Ktaily — Engineering Portfolio

A one-page portfolio built with HTML, CSS, and JavaScript. No framework, build step, package installation, API keys, or backend is required.

## Open it locally

Unzip the project, then open `index.html` in your browser. Keep the CSS, JavaScript, and `assets` directory beside it.

For a local web server, run this inside the project directory:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

A separate `Yusif-Ktaily-Preview.html` is provided with this delivery. Its images, code, and video are embedded so it can be opened on its own. Use the project directory, not the preview file, for the maintainable GitHub version.

## Publish on GitHub Pages

1. Create a public repository, for example `portfolio`.
2. Upload the **contents** of this project directory. `index.html` must be at the repository's top level, next to `styles.css`, `script.js`, `site-config.js`, and `assets`. Do not upload only the ZIP or put everything inside an extra directory.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, then choose **main** and **/(root)**. Save.
4. After deployment finishes, the Pages settings show your website address. A project repository named `portfolio` normally uses `https://YOUR-GITHUB-USERNAME.github.io/portfolio/`.

All asset links are relative, so the site also works at a repository subpath. The `.nojekyll` file keeps this a plain static deployment. No custom domain is required.

Official reference: [GitHub Pages publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

**The delivered files are not a live deployment.** Publishing is the separate step above.

## Quick edits

Open `site-config.js` for contact links and the two deferred items.

### Personal introduction

The hero currently says “Personal introduction coming soon.” Change:

```js
personalIntro: null,
```

to:

```js
personalIntro: "Your finished personal introduction goes here.",
```

The script inserts plain text safely. The separate About section already contains the interests you described: fragrances/flavours, Brazilian jiu-jitsu, and piano.

### Add the résumé later

Place the finished PDF at:

```text
assets/documents/Yusif-Ktaily-Resume.pdf
```

Then change the résumé setting to:

```js
resume: {
  enabled: true,
  path: "assets/documents/Yusif-Ktaily-Resume.pdf",
  filename: "Yusif-Ktaily-Resume.pdf"
}
```

This reveals the résumé links in both the hero and the contact section. Leave `enabled: false` until the actual file exists. No broken or “coming soon” résumé button is currently shown.

### Change project descriptions

Edit `index.html`. The five work sections are identified by:

```text
#galvanic
#golf
#robotics
#internship
#leadership
```

Each has a short overview and a native `<details>` element for the full description. The main page stays concise without moving the reader to a different page.

### Add or replace a photograph

Copy the image into `assets/images/`, update its `<img src="...">`, and update the `alt` text and `data-caption`. The JavaScript automatically groups elements with the same `data-gallery` value into a lightbox.

Example:

```html
<figure>
  <button
    type="button"
    class="media-trigger"
    data-gallery="leadership"
    data-caption="Your accurate description of the National Day photograph."
    aria-label="Enlarge the National Day photograph">
    <img
      src="assets/images/national-day.webp"
      alt="An accurate description of what the photograph shows"
      width="1200"
      height="800"
      loading="lazy">
  </button>
  <figcaption>UAE National Day</figcaption>
</figure>
```

There is a `NATIONAL DAY` comment inside the leadership section where a future image can be added. Until then, the event is described in text without an empty public photo slot.

For the existing gallery, add the new `<figure>` inside `.leadership-photo-grid` and adjust the grid layout in `styles.css` as needed.

## File map

```text
index.html                  Page structure and portfolio copy
styles.css                  Blue-and-white visual design and responsive layouts
site-config.js              Email, LinkedIn, introduction, résumé switch
script.js                   Navigation, reading progress, and image lightboxes
assets/favicon.svg          YK monogram
assets/images/              Optimised photographs, figures, and certificate excerpt
assets/video/               Short silent site walkthrough
assets/documents/           Reserved for the completed résumé
CONTENT_NOTES.md             Content decisions and checks before publishing
QA_SUMMARY.md                Tests performed for this version
.nojekyll                   Static GitHub Pages deployment marker
```

## Design and behaviour

- A sticky section navigation, mobile menu, and subtle reading-progress line.
- Three technical projects followed by Internship, Leadership Work, About, and Contact.
- Full-size image galleries with previous/next controls, arrow keys, swipe gestures, Escape to close, and focus restoration.
- An 8-second, user-initiated site clip. No autoplay, no audio, and no video preload.
- Lazy-loaded WebP images, reduced-motion support, meaningful image descriptions, and a skip-to-content link.
- No analytics, contact-form service, or third-party JavaScript.

Headings and body text optionally use Google-hosted Manrope and DM Sans. No font files are included. System fonts are used when those external stylesheets are unavailable; the site still functions offline.

## Before making it public

Read `CONTENT_NOTES.md`, review the final copy and image captions, and confirm that the photographs, report figures, and video are appropriate for a public portfolio. The contact address supplied is intentionally visible. The résumé and personal introduction can remain deferred while you review this version.
