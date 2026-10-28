"""Optional authoring helper: python3 authoring/rebuild.py (standard library only).

GitHub Pages serves the repository root directly; no build is required on GitHub.
"""
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parent
SITE = ROOT.parent

def esc(value):
    return html.escape(str(value), quote=True)

def bib_escape(value):
    return str(value).replace('&', r'\&').replace('–', '--').replace('—', '---')

def bibliography(p):
    fields = [('author', p['authors'].replace(', ', ' and ')), ('title', '{' + p['title'] + '}'), ('year', str(p['year']))]
    venue_key = {'article': 'journal', 'inproceedings': 'booktitle', 'phdthesis': 'school'}.get(p['bibtype'])
    if venue_key:
        fields.append((venue_key, p['venueFull']))
    for key in ['series', 'volume', 'number', 'pages', 'publisher', 'doi', 'url']:
        if p.get(key):
            fields.append((key, p[key]))
    if p.get('eprint'):
        fields.extend([('eprint', p['eprint']), ('archivePrefix', 'arXiv'), ('note', 'Preprint')])
    if p['status'] == 'Accepted':
        fields.append(('note', 'Accepted at ' + p['venueFull'] + '; proceedings publication pending'))
    elif p['status'] == 'Submitted':
        fields.append(('note', 'Manuscript submitted to ' + p['venueFull'] + '; not yet accepted or published'))
    elif p['status'] == 'Under review':
        fields.append(('note', 'Review manuscript submitted to ' + p['venueFull'] + '; under review'))
    if p.get('publicationNote'):
        fields.append(('note', p['publicationNote']))
    return '@' + p['bibtype'] + '{' + p['id'] + ',\n' + ',\n'.join('  ' + k + ' = {' + bib_escape(v) + '}' for k, v in fields) + '\n}'

def main():
    papers = json.loads((ROOT / 'publications.json').read_text())
    rows = []
    for p in papers:
        p['bibtex'] = bibliography(p)
        p['citation'] = f"{p['authors']} ({p['year']}). {p['title']}. {p['venueFull']}."
        if p['status'] not in ['Published', 'Dissertation']:
            p['citation'] += f" [{p['status']}]"
        if p.get('publicationNote'):
            p['citation'] += ' ' + p['publicationNote'] + '.'
        if p.get('doi'):
            p['citation'] += ' https://doi.org/' + p['doi']
        elif p.get('url'):
            p['citation'] += ' ' + p['url']
        title = esc(p['title'])
        if p.get('url'):
            title = '<a href="' + esc(p['url']) + '" target="_blank" rel="noopener">' + title + '</a>'
        authors = esc(p['authors']).replace('Sruthi Rachamalla', '<strong>Sruthi Rachamalla</strong>').replace('S. Rachamalla', '<strong>S. Rachamalla</strong>')
        topic = 'AI & systems' if p['topic'] == 'ai' else 'Mobility & incentives'
        links = ''
        if p.get('url'):
            links += f'<a class="paper-link" href="{esc(p["url"])}" target="_blank" rel="noopener">{esc(p["linkLabel"])} <svg class="icon" aria-hidden="true"><use href="#i-external"/></svg></a>'
        for link in p.get('links', []):
            links += f'<a class="paper-link" href="{esc(link["url"])}" target="_blank" rel="noopener">{esc(link["label"])} <svg class="icon" aria-hidden="true"><use href="#i-external"/></svg></a>'
        if p.get('pdf'):
            links += f'<a class="paper-link" href="{esc(p["pdf"])}" target="_blank" rel="noopener">PDF <svg class="icon" aria-hidden="true"><use href="#i-external"/></svg></a>'
        links += f'<button type="button" class="cite-button" data-cite="{esc(p["id"])}" aria-label="Cite {esc(p["title"])}" hidden>Cite <svg class="icon" aria-hidden="true"><use href="#i-copy"/></svg></button>'
        award = '<p class="publication-award">' + esc(p['award']) + '</p>' if p.get('award') else ''
        status_class = re.sub(r'[^a-z0-9]+', '-', p['status'].lower()).strip('-')
        rows.append(f'''<article class="publication" id="pub-{esc(p['id'])}" data-id="{esc(p['id'])}" data-topic="{esc(p['topic'])}" data-status="{esc(p['status'])}">
          <div class="publication-year">{p['year']}</div>
          <div class="publication-body"><div class="publication-kicker"><span class="publication-status status-{status_class}">{esc(p['status'])}</span><span class="publication-topic">{esc(topic)}</span></div><h3>{title}</h3><p class="publication-authors">{authors}</p><p class="publication-venue">{esc(p['venue'])}</p><p class="publication-description">{esc(p['description'])}</p>{award}</div>
          <div class="publication-actions">{links}</div>
        </article>''')
    template = (ROOT / 'index.template.html').read_text()
    output = template.replace('{{PUBLICATIONS}}', '\n'.join(rows)).replace('{{PUBLICATION_JSON}}', json.dumps(papers, ensure_ascii=False).replace('</', '<\\/'))
    assert '{{PUBLICATION' not in output
    (SITE / 'index.html').write_text(output)
    (SITE / 'assets' / 'publications.bib').write_text('\n\n'.join(p['bibtex'] for p in papers) + '\n')
    print(f'Built {len(papers)} publication entries and bibliography.')

if __name__ == '__main__':
    main()
