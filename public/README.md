# PR54 Vendor PDF Engine Files

Copy the `assets/` folder from this package into the root of `vibroslaw.github.io`.

Files included:

- `assets/vendor/pdf-lib.min.js`
- `assets/vendor/fontkit.umd.min.js`
- `assets/vendor/licenses/pdf-lib-LICENSE.md`
- `assets/vendor/licenses/pdf-lib-fontkit-LICENSE.md`
- `assets/vendor/VENDOR_MANIFEST.json`

Source packages used:

- `pdf-lib@1.17.1` → `dist/pdf-lib.min.js`
- `@pdf-lib/fontkit@1.1.1` → `dist/fontkit.umd.min.js`

Notes:

- These are vendor JavaScript libraries for the PR54 print-master PDF engine.
- They do not come from font folders.
- Font folders should separately contain their own `OFL.txt` or `LICENSE.txt`.
- The `@pdf-lib/fontkit` npm tarball declares MIT in package.json but does not include a standalone LICENSE file; the included license file records this for repository compliance.
