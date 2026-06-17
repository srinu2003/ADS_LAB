const {
  Document, Packer, Paragraph, TextRun,
  Header, Footer, AlignmentType,
  BorderStyle, PageBorderDisplay, PageBorderOffsetFrom,
  PageBreak, LineRuleType, XmlComponent, XmlAttributeComponent,
} = require('docx');
const fs = require('fs');

class BordersDoNotSurroundHeader extends XmlComponent {
  constructor() {
    super('w:bordersDoNotSurroundHeader');
  }
}

class BordersDoNotSurroundFooter extends XmlComponent {
  constructor() {
    super('w:bordersDoNotSurroundFooter');
  }
}

// ──────────────────────────────────────────────────────────────
// Custom components for right-aligned Positional Tab
// ──────────────────────────────────────────────────────────────
class PositionalTabAttributes extends XmlAttributeComponent {
  constructor(properties) {
    super(properties);
    this.xmlKeys = {
      relativeTo: 'w:relativeTo',
      alignment: 'w:alignment',
      leader: 'w:leader',
    };
  }
}

class PositionalTab extends XmlComponent {
  constructor() {
    super('w:ptab');
    this.root.push(new PositionalTabAttributes({
      relativeTo: 'indent',
      alignment: 'right',
      leader: 'none',
    }));
  }
}

class PositionalTabRun extends XmlComponent {
  constructor() {
    super('w:r');
    const rPr = new XmlComponent('w:rPr');
    rPr.root.push(new XmlComponent('w:b'));
    rPr.root.push(new XmlComponent('w:bCs'));
    this.root.push(rPr);
    this.root.push(new PositionalTab());
  }
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
const TNR = 'Times New Roman';

/** Default-style paragraph (Times New Roman 12pt, line=276) */
function dp(children, extra = {}) {
  return new Paragraph({
    spacing: { line: 276, lineRule: LineRuleType.AUTO },
    ...extra,
    children,
  });
}

/** Bold run (Times New Roman 12pt) */
const B = (text) =>
  new TextRun({ text, bold: true, font: TNR, size: 24 });

/** Regular run (Times New Roman 12pt) */
const R = (text) =>
  new TextRun({ text, font: TNR, size: 24 });

/** Empty line */
const blank = () =>
  dp([new TextRun({ text: '', font: TNR, size: 24 })]);

/** Code line (optional left indent for deeply nested lines) */
function code(text, indentLeft) {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO },
    indent: indentLeft ? { left: indentLeft } : undefined,
    children: [new TextRun({ text, font: 'Consolas', size: 20 })],
  });
}

// ──────────────────────────────────────────────────────────────
// Header: "Student Name: [ptab] Roll No:" — Verdana Bold 10pt
// ──────────────────────────────────────────────────────────────
const pageHeader = new Header({
  children: [
    new Paragraph({
      children: [
        new TextRun({
          text: 'Student Name: ',
          bold: true, font: 'Verdana', size: 20,
        }),
        new PositionalTabRun(),
        new TextRun({
          text: 'Roll No:',
          bold: true, font: 'Verdana', size: 20,
        }),
      ],
    }),
  ],
});



// ──────────────────────────────────────────────────────────────
// Footer: "I. M.Tech (CSE), II Sem   [ptab]   Advanced Algorithms Lab"
// ──────────────────────────────────────────────────────────────
const pageFooter = new Footer({
  children: [
    new Paragraph({
      children: [
        new TextRun({
          text: 'I. M.Tech (CSE), II Sem',
          bold: true,
          font: TNR,
          size: 20,
        }),
        new PositionalTabRun(),
        new TextRun({
          text: 'Advanced Algorithms Lab',
          bold: true,
          font: TNR,
          size: 20,
        }),
      ],
    }),
  ],
});

// ──────────────────────────────────────────────────────────────
// Page border (thinThickSmallGap on all sides)
// ──────────────────────────────────────────────────────────────
const pageBorderOpts = {
  pageBorders: {
    display: PageBorderDisplay.ALL_PAGES,
    offsetFrom: PageBorderOffsetFrom.TEXT,
  },
  pageBorderTop: { style: BorderStyle.THIN_THICK_SMALL_GAP, size: 24, color: 'auto', space: 1 },
  pageBorderBottom: { style: BorderStyle.THICK_THIN_SMALL_GAP, size: 24, color: 'auto', space: 1 },
  pageBorderLeft: { style: BorderStyle.THIN_THICK_SMALL_GAP, size: 24, color: 'auto', space: 4 },
  pageBorderRight: { style: BorderStyle.THICK_THIN_SMALL_GAP, size: 24, color: 'auto', space: 4 },
};

// ──────────────────────────────────────────────────────────────
// First Page — Experiment 1
// ──────────────────────────────────────────────────────────────
const experiment1 = [
  // "Experiment-1" — 5 tabs + bold (original indent: start=360)
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [B('Experiment-1')],
  }),
  blank(),

  // Experiment title
  dp([B('Experiment: Implement assignment problem using Brute Force method')]),
  blank(),

  // AIM
  dp([B('AIM: '), R('To Implement assignment problem using Brute Force Method')]),
  blank(),

  // Description
  dp([B('Description: ')]),
  blank(),

  // Program
  dp([B('Program:')]),

  // ── Code block ──
  ...fs.readFileSync('aa_exp1.py', 'utf8')
    .split(/\r?\n/)
    .map(line => code(line)),
  blank(),

  // INPUT
  dp([B('INPUT: ')]),
  blank(),

  // OUTPUT
  dp([B('OUTPUT:-')]),
  code('Best Assignment: (1, 2, 3, 0)'),
  code('Minimum Cost: 21'),
  blank(),

  // Conclusion
  dp([B('Conclusion:')]),
  blank(),
  blank(),
  blank(),
];

// ──────────────────────────────────────────────────────────────
// Last Page — Additional Experiment / Micro Project
// Centered, Times New Roman Bold 12pt
// ──────────────────────────────────────────────────────────────
function centeredBlank() {
  return new Paragraph({
    spacing: { line: 276, lineRule: LineRuleType.AUTO },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '', font: TNR, size: 24 })],
  });
}

function centeredBold(text) {
  return new Paragraph({
    spacing: { line: 276, lineRule: LineRuleType.AUTO },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, font: TNR, size: 24 })],
  });
}

const lastPage = [
  // push content toward vertical center
  ...Array(14).fill(null).map(centeredBlank),

  centeredBold('Additional Experiment'),

  ...Array(6).fill(null).map(centeredBlank),

  centeredBold('MICRO PROJECT'),
];

// ──────────────────────────────────────────────────────────────
// Build Document
// ──────────────────────────────────────────────────────────────
const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },       // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 708, footer: 708 },
          borders: pageBorderOpts,
        },
      },
      headers: { default: pageHeader },
      footers: { default: pageFooter },
      children: [
        ...experiment1,

        // ── Page break → Last Page ──
        new Paragraph({ children: [new PageBreak()] }),

        ...lastPage,
      ],
    },
  ],
});

doc.settings.root.push(new BordersDoNotSurroundHeader());
doc.settings.root.push(new BordersDoNotSurroundFooter());

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./outputs/lab_record_recreated.docx', buffer);
  console.log('✅  lab_record_recreated.docx written successfully!');
});
