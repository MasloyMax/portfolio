import json
import sys
import re
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from xml.sax.saxutils import escape, quoteattr
import xml.etree.ElementTree as ET

sys.stdin.reconfigure(encoding='utf-8')
data = json.load(sys.stdin)
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
PKG = 'http://schemas.openxmlformats.org/package/2006/relationships'
XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
links = {
    'masloymax@gmail.com': ('email', 'mailto:masloymax@gmail.com'),
    '@masloymax': ('telegram', 'https://t.me/masloymax'),
    'masloymax.github.io/portfolio': ('portfolio', 'https://masloymax.github.io/portfolio/'),
}
link_pattern = re.compile('|'.join(map(re.escape, links)))

def run(text, bold=False):
    props = '<w:rPr><w:b/></w:rPr>' if bold else ''
    return f'<w:r>{props}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'

def runs(text):
    result, offset = [], 0
    for match in link_pattern.finditer(text):
        result.append(run(text[offset:match.start()]))
        rid, _ = links[match.group()]
        result.append(f'<w:hyperlink r:id="{rid}">{run(match.group())}</w:hyperlink>')
        offset = match.end()
    result.append(run(text[offset:]))
    return ''.join(result)

paragraphs = []
for block in data['blocks']:
    bullet = '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' if block['style'] == 'bullet' else ''
    props = f'<w:pPr><w:pStyle w:val="{block["style"]}"/>{bullet}</w:pPr>'
    text = (run(block['label'] + ' ', True) if block.get('label') else '') + runs(block['text'])
    paragraphs.append(f'<w:p>{props}{text}</w:p>')
section = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="794" w:right="907" w:bottom="794" w:left="907" w:header="0" w:footer="0" w:gutter="0"/><w:cols w:num="1"/></w:sectPr>'
document = XML + f'<w:document xmlns:w="{W}" xmlns:r="{R}"><w:body>{"".join(paragraphs)}{section}</w:body></w:document>'

style_specs = {
    'name': (42, True, 0, 60, 462, True, 0),
    'role': (24, True, 0, 100, 288, True, None),
    'contact': (19, False, 0, 0, 247, True, None),
    'section': (24, True, 180, 80, 288, True, 1),
    'body': (21, False, 0, 30, 252, False, None),
    'skill': (21, False, 0, 30, 252, False, None),
    'job': (21, True, 140, 40, 252, True, 2),
    'jobrole': (21, False, 0, 60, 252, True, None),
    'bullet': (21, False, 0, 40, 252, False, None),
}
style_xml = []
for name, (size, bold, before, after, line, keep, outline) in style_specs.items():
    ppr = f'<w:spacing w:before="{before}" w:after="{after}" w:line="{line}" w:lineRule="exact"/><w:widowControl/><w:keepLines/>'
    if keep:
        ppr += '<w:keepNext/>'
    if outline is not None:
        ppr += f'<w:outlineLvl w:val="{outline}"/>'
    rpr = f'<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/><w:lang w:val="ru-RU"/>'
    if bold:
        rpr += '<w:b/>'
    style_xml.append(f'<w:style w:type="paragraph" w:styleId="{name}"><w:name w:val="{name}"/><w:basedOn w:val="Normal"/><w:pPr>{ppr}</w:pPr><w:rPr>{rpr}</w:rPr></w:style>')
styles = XML + f'<w:styles xmlns:w="{W}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="21"/><w:lang w:val="ru-RU"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>{"".join(style_xml)}</w:styles>'
numbering = XML + f'<w:numbering xmlns:w="{W}"><w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="280"/></w:tabs><w:ind w:left="280" w:hanging="280"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="1"/></w:num></w:numbering>'
settings = XML + f'<w:settings xmlns:w="{W}"><w:defaultTabStop w:val="720"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>'
rels = [f'<Relationship Id="{name}" Type="{R}/{kind}" Target="{target}"/>' for name, kind, target in [('styles', 'styles', 'styles.xml'), ('numbering', 'numbering', 'numbering.xml'), ('settings', 'settings', 'settings.xml')]]
rels += [f'<Relationship Id="{rid}" Type="{R}/hyperlink" Target={quoteattr(url)} TargetMode="External"/>' for rid, url in links.values()]
document_rels = XML + f'<Relationships xmlns="{PKG}">{"".join(rels)}</Relationships>'
root_rels = XML + f'<Relationships xmlns="{PKG}"><Relationship Id="document" Type="{R}/officeDocument" Target="word/document.xml"/><Relationship Id="core" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'
core = XML + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Максим Маслов — Automation QA Engineer</dc:title><dc:creator>Максим Маслов</dc:creator><dc:language>ru-RU</dc:language></cp:coreProperties>'
content_types = XML + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' + ''.join(f'<Override PartName="/{path}" ContentType="{kind}"/>' for path, kind in {
    'word/document.xml': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml',
    'word/styles.xml': 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml',
    'word/numbering.xml': 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml',
    'word/settings.xml': 'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml',
    'docProps/core.xml': 'application/vnd.openxmlformats-package.core-properties+xml',
}.items()) + '</Types>'
files = {'[Content_Types].xml': content_types, '_rels/.rels': root_rels, 'word/document.xml': document, 'word/styles.xml': styles, 'word/numbering.xml': numbering, 'word/settings.xml': settings, 'word/_rels/document.xml.rels': document_rels, 'docProps/core.xml': core}
output = Path(data['basename'] + '.docx')
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for path, xml in files.items():
        ET.fromstring(xml)
        archive.writestr(path, xml.encode('utf-8'))
with ZipFile(output) as archive:
    assert archive.testzip() is None
    root = ET.fromstring(archive.read('word/document.xml'))
    actual = [''.join(p.itertext()) for p in root.findall(f'{{{W}}}body/{{{W}}}p')]
    expected = [' '.join(filter(None, [b.get('label'), b['text']])) for b in data['blocks']]
    assert actual == expected, 'DOCX text differs from reviewed content'
print(json.dumps({'file': str(output), 'bytes': output.stat().st_size, 'verified_paragraphs': len(actual)}, ensure_ascii=True))
