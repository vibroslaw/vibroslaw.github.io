# PR54 local PDF vendor files

This folder is reserved for the local PDF engine dependencies required by the Veritas Humanum PR54 print-master system.

Required files:

- `pdf-lib.min.js` — official `pdf-lib@1.17.1` distribution file from `dist/pdf-lib.min.js`
- `fontkit.umd.min.js` — official `@pdf-lib/fontkit@1.1.1` distribution file from `dist/fontkit.umd.min.js`
- `licenses/pdf-lib-LICENSE.md`
- `licenses/pdf-lib-fontkit-LICENSE.md`
- `VENDOR_MANIFEST.json`

Do not create placeholder JavaScript vendor files. Do not hand-write or re-minify these libraries. Copy the official distribution files from npm package tarballs.

The PR54 vector PDF engine can run in compatibility mode through the existing PDFLib global, but the final no-CDN production state requires the two local vendor files listed above.
