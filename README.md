# AI Moderator website

The public English-language website for SmartLearning’s AI Moderator, intended for university educators, learning labs and teaching and learning teams.

- Website: https://aimoderator.online/
- Review preview: https://smartlearning-ai-moderator-preview.netlify.app/
- Hosting: GitHub Pages, serving the root of `main`.

## Local preview

```sh
python3 -m http.server 4173
```

Open http://localhost:4173. The site is static and has no build dependencies.

## Files

- `index.html`: page content, dialogue examples, video players and transcripts.
- `styles.css` and `brand.css`: responsive layout and SmartLearning visual identity.
- `app.js`: mobile navigation, discussion tabs, video playback coordination and section-link alignment.
- `assets/`: local fonts and their licences, institutional logos, and three one-minute films with English captions.
- `CNAME`: the existing custom domain. Keep this file when updating the site.
- `.nojekyll`: serves the files without Jekyll processing.
- `docs/verification/2026-11-04/`: browser checks, screenshots and logo provenance.

`_headers` contains headers for compatible static hosts such as Netlify. GitHub Pages does not apply this file; it is not evidence that those headers are active on the public domain.

## Verification

The published design was reviewed at widths from 320 to 1920 pixels. Menu links were checked on desktop, tablet and phone, including direct section URLs after font loading. The latest revision reduces the space above section labels to 40px, 32px and 28px respectively. Keyboard navigation, disclosures and video metadata were checked. These are browser viewport tests, not certification on every physical device.

The films use actual interface screenshots with fictional sample data. They illustrate a synchronous discussion; the website also describes asynchronous use. Learning outcomes are not presented as established results.

Publication provenance is recorded in `docs/publication.json`. Compared with the tested Netlify preview, production changes are limited to the root hosting layout, domain metadata and search-engine indexing settings.

## Previous version

The version replaced by this publication remains in Git history and on branch [`backup/before-website-update-2026-11-04`](https://github.com/SmartLearning-Org/aimoderator-site/tree/backup/before-website-update-2026-11-04), at commit `6300d4db95772c7f10ef566647b6e5b27d01d037`.

To restore a previous version, create a new commit or revert the website replacement commit. A force push is not needed.
