# Amr Ahmed — Creative Studio

Responsive portfolio and client-inquiry website built with plain HTML, CSS and JavaScript (no build step).

## Files
- `index.html` — website sections and the project inquiry form
- `styles.css` — responsive styling
- `script.js` — mobile navigation, project filter, and form submission
- `success.html` — confirmation page shown after a successful inquiry
- `404.html` — not-found page (GitHub Pages serves it automatically)
- `og-image.jpg`, `favicon-*.png`, `apple-touch-icon.png` — social preview and icons
- `amr-portrait.webp`, `amr-logo.webp` — optimised images used on the page
- `admin.html`, `admin.css`, `admin.js` — private studio admin panel (inquiries, clients, projects, tasks, payments), signed in with an email magic link
- `admin/index.html` — admin route
- `robots.txt`, `sitemap.xml`, `google5ab190668ae6a82d.html` — SEO and Google Search Console verification

## How it works
- **Hosting:** GitHub Pages, published from the `main` branch (repository root).
- **Inquiry form:** submits to Formspree, which emails the inquiry. The same inquiry is then saved to the `leads` table in Supabase.
- **Admin panel:** reads and manages data in Supabase. Only the authorised admin email can sign in.

## After changing the site
- Update the `sitemap.xml` URL if the domain changes.
- Test the inquiry form: the email should arrive via Formspree and a new row should appear in the admin panel under Inquiries.

## Before launch
- Replace the illustrative project panels with approved real project imagery and accurate descriptions.
- Add the Behance profile URL, WhatsApp contact and consultation booking link if desired.
- Add client testimonials only with client approval.

## Contact
amr.ahmed39200@gmail.com
