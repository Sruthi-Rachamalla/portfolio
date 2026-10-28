# Sruthi Rachamalla — personal research website

A complete static academic website, ready for GitHub Pages. It uses original vector artwork, responsive layouts, light and dark themes, a searchable publication list, citation copying, downloadable BibTeX, and a public academic CV.

## Update the existing GitHub Pages site

Target repository: **Sruthi-Rachamalla/portfolio**, branch **main**. Existing site: https://sruthi-rachamalla.github.io/portfolio/

Upload this package’s contents to the repository root, replacing the existing website files, then commit to `main`. The existing GitHub Pages configuration can publish the update at the same address. The separately provided single-file HTML can also replace `index.html` by itself; it embeds all required assets.

## Publish as a new GitHub Pages site

1. Unzip this package.
2. On GitHub, create a repository called **YOUR-USERNAME.github.io**, replacing YOUR-USERNAME with your actual GitHub username. Use a public repository for GitHub Free.
3. Upload the **contents** of this package to the repository. `index.html` and the `assets` folder must sit at the repository root, rather than inside another folder. Include `.nojekyll`; it may be hidden in your file browser. If it is omitted while uploading, create an empty `.nojekyll` file through GitHub's Add file → Create new file action.
4. Commit the files to the `main` branch.
5. Open **Settings → Pages**. Set Source to **Deploy from a branch**, Branch to **main**, and Folder to **/ (root)**. Save.
6. Visit **https://YOUR-USERNAME.github.io/** when GitHub finishes deploying. Publication may take up to ten minutes.

The same files also work as a project site at `https://YOUR-USERNAME.github.io/REPOSITORY/`; all local asset references are relative.

Official instructions:

- https://docs.github.com/en/pages/quickstart
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

No package installation, framework build, API key, database, paid hosting, or custom GitHub Actions workflow is required. The files are already built. The included `authoring` folder is optional editing material and can remain in the repository.

## Preview locally

Open `index.html` in a browser. For a local server, run `python3 -m http.server 8000` from this folder and open http://localhost:8000. JavaScript does not fetch external data, so the publication content also works from a local file.

The separately provided `Sruthi_Rachamalla_Website.html` is a portable, single-file edition of this site, with the stylesheet, JavaScript, favicon, bibliography, and CV embedded. The ZIP version is preferable for GitHub hosting and ongoing edits.

## Contents

- `index.html`: the complete page, including every publication as static HTML.
- `assets/site.css`: all layout, theme, responsive, and print styles.
- `assets/site.js`: progressive enhancements for filtering, citations, research-map selection, theme switching, mobile navigation, and copying contact details.
- `assets/favicon.svg`: original research-map mark.
- `assets/sruthi-rachamalla-cv.pdf`: four-page public academic CV.
- `assets/publications.bib`: all 12 works with appropriate publication types and status notes.
- `.nojekyll`: tells GitHub Pages to serve the static files directly.
- `authoring/index.template.html`: editable HTML source.
- `authoring/publications.json`: editable publication records.
- `authoring/rebuild.py`: optional Python standard-library helper to regenerate `index.html` and the bibliography from the source files.
- `CONTENT_SOURCES.md`: editorial provenance and maintenance notes.

## Edit the site

For the simplest workflow, edit `index.html`, `assets/site.css`, or `assets/site.js` directly. These are the deployed files.

For publication changes, the recommended workflow is to edit `authoring/publications.json` and run:

```bash
python3 authoring/rebuild.py
```

This also regenerates the publication markup and BibTeX. Make permanent biography/section changes in `authoring/index.template.html` if you use this helper. Direct changes to `index.html` are overwritten by a rebuild.

Replace the PDF at the same path when updating your CV. Keep the filename stable to preserve existing links.

### Publication fields

Each record contains an ID, year, status, topic, title, authors, short and full venue names, description, bibliographic type, and optional DOI, public URL, and PDF URL. Additional public links can be supplied in a `links` array with `label` and `url` fields. Topics are `ai` and `mobility`. Supported statuses are `Published`, `Accepted`, `Under review`, `Submitted`, `Preprint`, and `Dissertation`.

Use `unpublished` as the BibTeX type for an accepted paper until proceedings metadata is available. Submitted manuscripts and papers under review must retain their explicit status. The platooning paper now cites its published Springer proceedings version (2027 citation year, first online September 2, 2026), with ResearchGate and the earlier arXiv preprint linked on the same entry. The doctoral dissertation is a separate record.

## Content decisions

- The site represents **Dr. Sruthi Rachamalla**, following the recent research profile and CV supplied in prior conversations.
- Current position: Software Engineer, VSSIQ Inc., April 2026–present. Previous position: Software Engineer, Infoville Inc., April 2024–March 2026.
- Scholar and ORCID links were extracted from the actual CV, not inferred from a name search.
- The CATA distinction is **Best Paper Finalist Award**, following the more precise user-provided correction and dissertation record. It is not presented as a best-paper win.
- Six published papers, three accepted papers, one submitted manuscript, one preprint, and one dissertation are explicitly distinguished.
- The public CV omits the personal phone number and internal business performance figures.
- No headshot, GitHub username, LinkedIn profile, citation count, or editorial appointment was invented. The original research map gives the site a visual identity without requiring a photograph.
- A portrait can be added later using a genuine image. The verified GitHub profile and canonical portfolio URL are included for Sruthi-Rachamalla/portfolio.

## Accessibility and privacy

A dedicated Teaching Experience section covers the SIU Instructor, XRDA Graduate Assistant, Teaching Assistant, and Graduate Mentor appointments, with exact terms and course names from the CV. Teaching appears in the desktop and mobile navigation.

The site includes semantic landmarks, a skip link, visible focus states, named controls, status announcements for filters, native citation dialogs, responsive navigation, and reduced-motion styling. All scholarly content is visible without JavaScript. Search/filter and copy controls are revealed only when JavaScript is available. Print styles include all publications, even when the screen view is filtered.

There are no analytics, tracking pixels, cookies, external fonts, or third-party JavaScript libraries. The selected theme is stored only in the visitor's browser. External paper/profile links and email actions leave the site only when chosen by the visitor.

## After publishing

Add the final site address to Google Scholar and ORCID if desired. Add a canonical URL and optional absolute social-preview image URL to the HTML once the final GitHub Pages address is known. A custom domain is optional.

Publication statuses and professional details were prepared from the October 2026 materials. Update accepted/submitted status when proceedings or editorial decisions become available.
