# poke

Refresh the page → a new creature grows from random genes.

Poke it → it giggles. The giggle (text + sound) is shaped by the same genome.

## Local

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

Optional query params:

- `?seed=12345` — same creature every time
- `?genome` — show a simple genome readout

## GitHub Pages

Pushes to `main` run [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which validates the site and deploys it to GitHub Pages.

In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
