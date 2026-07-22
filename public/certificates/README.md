# Certificate PDFs (view-only on the website)

Place official PDFs here. The Certificates page loads them from `/certificates/…`.

| Filename                 | Certificate                     |
|--------------------------|---------------------------------|
| `startup-india.pdf`      | DPIIT Startup India Recognition |
| `gst-registration.pdf`   | GST Registration Certificate    |
| `iso-9001.pdf`           | ISO 9001:2015 Quality Management|
| `udyam-registration.pdf` | MSME Udyam Registration         |

These PDF files **must be committed and deployed** with the app (`public/certificates/`).
If they are missing on Hostinger, GitHub clone will not show previews.

The PDF.js worker is loaded from jsDelivr (matching `pdfjs-dist` version) so Hostinger
MIME issues with `/pdf.worker.min.mjs` do not break certificate viewing.
Keep `public/pdf.worker.min.mjs` as an offline/local fallback asset.
