const {
  Document, Packer, Paragraph, TextRun,
  Header, Footer, AlignmentType,
  BorderStyle, PageBorderDisplay, PageBorderOffsetFrom,
  PageBreak, LineRuleType,
} = require('docx');
const fs = require('fs');

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
function code(text, indent) {
  return dp([R(text)], indent ? { indent } : {});
}

// ──────────────────────────────────────────────────────────────
// Header: "Student Name: [gap] Roll No:" — Verdana Bold 10pt
// ──────────────────────────────────────────────────────────────
const pageHeader = new Header({
  children: [
    new Paragraph({
      children: [
        new TextRun({
          text: 'Student Name: ',
          bold: true, font: 'Verdana', size: 20,
        }),
        // long whitespace tab matching original spacing
        new TextRun({
          text: '\t                                                          Roll No:',
          bold: true, font: 'Verdana', size: 20,
        }),
      ],
    }),
  ],
});

// ──────────────────────────────────────────────────────────────
// Footer: "I. M.Tech (CSE), II Sem   [tabs]   Advanced Algorithms Lab"
// ──────────────────────────────────────────────────────────────
const pageFooter = new Footer({
  children: [
    new Paragraph({
      children: [
        new TextRun({ text: 'I. M.Tech (CSE), II Sem', bold: true, size: 20 }),
        new TextRun({ text: '\t\t\tAdvanced Algorithms Lab', bold: true, size: 20 }),
      ],
    }),
  ],
});

// ──────────────────────────────────────────────────────────────
// Page border (thinThickSmallGap on all sides)
// ──────────────────────────────────────────────────────────────
const pageBorderOpts = {
  pageBorderTop: { style: BorderStyle.THIN_THICK_SMALL_GAP, size: 24, color: '000000', space: 1 },
  pageBorderBottom: { style: BorderStyle.THIN_THICK_SMALL_GAP, size: 24, color: '000000', space: 1 },
  pageBorderLeft: { style: BorderStyle.THIN_THICK_SMALL_GAP, size: 24, color: '000000', space: 4 },
  pageBorderRight: { style: BorderStyle.THIN_THICK_SMALL_GAP, size: 24, color: '000000', space: 4 },
  display: PageBorderDisplay.ALL_PAGES,
  offsetFrom: PageBorderOffsetFrom.TEXT,
};

// ──────────────────────────────────────────────────────────────
// First Page — Experiment 1
// ──────────────────────────────────────────────────────────────
const experiment1 = [
  // "Experiment-1" — 5 tabs + bold (original indent: start=360)
  dp(
    [
      new TextRun({ text: '\t\t\t\t\t', font: TNR, size: 24 }),
      B('Experiment-1'),
    ],
    { indent: { left: 360 } }
  ),
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
  blank(),

  // ── Code block ──
  code('import itertools'),
  blank(),
  code('def assignment_bruteforce(cost_matrix):'),
  blank(),
  code('    n = len(cost_matrix)'),
  blank(),
  code("min_cost = float('inf')"),
  blank(),
  code('best_assignment = None'),
  blank(),
  code('    \tfor perm in itertools.permutations(range(n)):'),
  blank(),
  code('        \tcost = sum(cost_matrix[i][perm[i]] for i in range(n))'),
  blank(),
  code('        \t\tif cost <min_cost:'),
  blank(),
  code('min_cost = cost', { firstLine: 720, left: 720 }),
  blank(),
  code('best_assignment = perm', { firstLine: 720, left: 720 }),
  blank(),
  code('    return best_assignment, min_cost'),
  blank(),
  code('cost_matrix = ['),
  blank(),
  code('    [9, 2, 7, 8],'),
  blank(),
  code('    [6, 4, 3, 7],'),
  blank(),
  code('    [5, 8, 1, 8],'),
  blank(),
  code('    [7, 6, 9, 4]'),
  blank(),
  code(']'),
  blank(),
  code('assignment, cost = assignment_bruteforce(cost_matrix)'),
  blank(),
  code('print("Best Assignment:", assignment)'),
  blank(),
  code('print("Minimum Cost:", cost)'),
  blank(),

  // INPUT
  dp([B('INPUT: ')]),
  blank(),

  // OUTPUT
  dp([B('OUTPUT:-')]),
  blank(),
  code('Best Assignment: (1, 2, 3, 0)'),
  blank(),
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
          size: { width: 12240, height: 15840 },       // US Letter
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 720, footer: 720 },
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

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./outputs/lab_record_recreated.docx', buffer);
  console.log('✅  lab_record_recreated.docx written successfully!');
});
