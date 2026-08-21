# MG EV Car — Public Web Viewer

The uploaded `Car(1).glb` is already included as:

`models/MG-EV-Car.glb`

The GLB is approximately 6 MB, so it is much more suitable for a public web viewer than the earlier ~900 MB `.bin` workflow.

## Local test

Run a static web server from this folder:

`python -m http.server 8080`

Open:

`http://localhost:8080`

Do not open `index.html` by double-clicking it.

## Publish

Upload the entire folder to a static host such as Vercel, Netlify, or GitHub Pages. The resulting URL can be shared with clients; no desktop software is required.

The model is loaded automatically. There is no file-picker button for the visitor.
