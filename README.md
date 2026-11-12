# Ei — Eyal Izenman

A standalone, static portfolio: scroll to move through the gallery, or play the reel with music. Aether Gallery opens https://gallery3-d.vercel.app/.

## Publish with GitHub Pages

1. Extract this ZIP. Put the **contents** of `Ei-Portfolio-GitHub` at the root of a new GitHub repository, so `index.html` is at the top level. Do not upload the ZIP itself. GitHub Desktop is convenient for uploading the included videos.
2. Commit and push to `main`.
3. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, then **main** and **/(root)**, and Save.
4. Use the **Visit site** link shown in Pages after deployment completes.

Keep `.nojekyll` in the repository. No build, package installation, backend, API key, ChatGPT account, or OpenAI hosting is required. All local paths work both at a domain root and under a repository subdirectory. To change hosts, publish the same folder on any static web host.

## Run locally

From this folder, run `python3 -m http.server 8000` and open `http://localhost:8000/`. Use HTTP rather than opening the HTML as a local file, because the gallery loads videos and its catalog.

## What is included

- `index.html`: interactive scrolling gallery and film playback.
- `film.html`: linear presentation with Play/Pause, Resume and explicit Replay.
- `works.html`: direct work index, keyboard-accessible full-film player, and fallback when 3D rendering is unavailable or reduced motion is requested.
- `full/`: 11 complete films, serving 12 gallery frames. The two Surreal frames open the same complete film.
- `v/`: short gallery excerpts, including the three commercial excerpts.
- `art/`, `posters/`, `fonts/`, `three.min.js`, `data.js`, and `soundtrack-cut3.mp3`: local assets. The soundtrack analysis in data.js belongs with the supplied soundtrack.
- `licenses/`: third-party library and font notices. No new license is granted to the portfolio media by this package.

Pause preserves the exact playback position, including near the end. Scrolling deliberately returns to manual gallery navigation. Replay is the explicit restart action. Native full-film video controls keep their playback position on pause.

The three commercial projects remain excerpts because their complete sources were not supplied. Optional YouTube links and the Aether Gallery destination use their external sites; playback of the supplied complete films uses the local files.

## Editing

Edit the `FULL` title-to-file map in `index.html` and `full-film-catalog.json` together when changing full-film sources. Keep filenames and capitalization consistent. The published domain is not embedded in runtime asset paths. Once you choose a permanent URL, you may set an absolute `og:image` URL in the HTML metadata for social previews.

The original uploaded ZIP and the previously hosted versions were preserved separately. This folder contains the release files only, without hosting credentials or platform configuration.

GitHub references: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site and https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
