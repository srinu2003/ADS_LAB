const {
  Document, Packer, Paragraph, TextRun,
  Header, Footer, AlignmentType,
  BorderStyle, PageBorderDisplay, PageBorderOffsetFrom,
  PageBreak, LineRuleType, XmlComponent, XmlAttributeComponent,
} = require('docx');
const fs = require('fs');
const { execSync } = require('child_process');

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

/** Code line with monospaced font and preserved indentation spaces */
function code(text, indentLeft) {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO },
    indent: indentLeft ? { left: indentLeft } : undefined,
    children: [new TextRun({ text, font: 'Consolas', size: 20, preserveSpace: true })],
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
// Markdown Parsing & Code Processing
// ──────────────────────────────────────────────────────────────

const experimentTitles = {
  1: "Experiment: Implement assignment problem using Brute Force method",
  2: "Experiment: Perform multiplication of long integers using divide and conquer method",
  3: "Experiment: Implement a solution for the knapsack problem using the Greedy method",
  4: "Experiment: Implement Gaussian elimination method",
  5: "Experiment: Implement LU decomposition",
  6: "Experiment: Implement Warshall algorithm",
  7: "Experiment: Implement the Rabin Karp algorithm",
  8: "Experiment: Implement the KMP algorithm",
  9: "Experiment: Implement Horspool algorithm (implemented as Heap Sort)",
  10: "Experiment: Implement max-flow problem"
};

function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = content.split(/##\s+Experiment-/i);

  const experiments = [];

  for (let i = 1; i < sections.length; i++) {
    const rawSection = sections[i];
    const lines = rawSection.split(/\r?\n/).map(l => l.trimEnd());

    const id = parseInt(lines[0].trim(), 10);

    let aim = '';
    let description = '';
    let conclusion = '';
    let title = '';

    let currentField = 'TITLE';
    let titleLines = [];
    let descLines = [];
    let concLines = [];

    for (let j = 1; j < lines.length; j++) {
      const line = lines[j];
      const lineTrim = line.trim();
      const lineUpper = lineTrim.toUpperCase();

      if (lineUpper.startsWith('AIM:')) {
        aim = lineTrim.substring(4).trim();
        currentField = 'AIM';
        continue;
      }
      if (lineUpper.startsWith('**DESCRIPTION:**')) {
        currentField = 'DESCRIPTION';
        const extra = lineTrim.substring(16).trim();
        if (extra) descLines.push(extra);
        continue;
      }
      if (lineUpper.startsWith('**PROGRAM:**')) {
        currentField = 'PROGRAM';
        continue;
      }
      if (lineUpper.startsWith('**OUTPUT:-**')) {
        currentField = 'OUTPUT';
        continue;
      }
      if (lineUpper.startsWith('**CONCLUSION:**')) {
        currentField = 'CONCLUSION';
        const extra = lineTrim.substring(15).trim();
        if (extra) concLines.push(extra);
        continue;
      }
      if (lineTrim.startsWith('##')) {
        break;
      }

      if (currentField === 'TITLE') {
        if (lineTrim) titleLines.push(lineTrim);
      } else if (currentField === 'DESCRIPTION') {
        if (lineTrim) descLines.push(lineTrim);
      } else if (currentField === 'CONCLUSION') {
        if (lineTrim) concLines.push(lineTrim);
      }
    }

    title = titleLines.join(' ');
    description = descLines.join(' ');
    conclusion = concLines.join(' ');

    // Override/fallback using experimentTitles mapping
    title = experimentTitles[id] || title || `Experiment ${id}`;

    experiments.push({
      id,
      title,
      aim,
      description,
      conclusion,
      codeFile: `aa_exp${id}.py`,
      hasInput: id === 1,
      hasConclusion: !!conclusion,
    });
  }

  return experiments;
}

function processPythonCode(codeContent) {
  const lines = codeContent.split(/\r?\n/);
  const processedLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // 1. Skip pure comment lines
    if (trimmed.startsWith('#')) {
      continue;
    }

    // 2. Strip inline comments
    let cleanedLine = line;
    const hashIdx = line.indexOf('#');
    if (hashIdx !== -1) {
      cleanedLine = line.substring(0, hashIdx).trimEnd();
    }

    // 3. Skip consecutive blank lines
    if (cleanedLine.trim() === '') {
      if (processedLines.length > 0 && processedLines[processedLines.length - 1].trim() !== '') {
        processedLines.push('');
      }
      continue;
    }

    processedLines.push(cleanedLine);
  }

  // Clean up trailing empty lines
  while (processedLines.length > 0 && processedLines[processedLines.length - 1].trim() === '') {
    processedLines.pop();
  }

  return processedLines;
}

// ──────────────────────────────────────────────────────────────
// Generate Experiment Paragraphs
// ──────────────────────────────────────────────────────────────
const experimentParagraphs = [];
const parsedExps = parseMarkdown('lab_record_clean.md');

for (const exp of parsedExps) {
  // Page break before subsequent experiments
  if (exp.id > 1) {
    experimentParagraphs.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // 1. Experiment Header
  experimentParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [B(`Experiment-${exp.id}`)],
    })
  );
  experimentParagraphs.push(blank());

  // 2. Title
  experimentParagraphs.push(dp([B(exp.title)]));
  experimentParagraphs.push(blank());

  // 3. AIM
  experimentParagraphs.push(dp([B('AIM: '), R(exp.aim)]));
  experimentParagraphs.push(blank());

  // 4. Description
  experimentParagraphs.push(dp([B('Description: ')]));
  if (exp.description) {
    experimentParagraphs.push(dp([R(exp.description)]));
  }
  experimentParagraphs.push(blank());

  // 5. Program Header
  experimentParagraphs.push(dp([B('Program:')]));

  // 6. Python Code (Read, Clean Comments, Format)
  const codeRaw = fs.readFileSync(exp.codeFile, 'utf8');
  const codeLinesClean = processPythonCode(codeRaw);
  for (const line of codeLinesClean) {
    experimentParagraphs.push(code(line));
  }
  experimentParagraphs.push(blank());

  // 7. INPUT (only if hasInput is true)
  if (exp.hasInput) {
    experimentParagraphs.push(dp([B('INPUT: ')]));
    experimentParagraphs.push(blank());
  }

  // 8. OUTPUT Header
  experimentParagraphs.push(dp([B('OUTPUT:-')]));

  // 9. Output lines (Execute script and capture stdout)
  try {
    const stdout = execSync(`python ${exp.codeFile}`, { encoding: 'utf8' });
    const stdoutLines = stdout.split(/\r?\n/);
    if (stdoutLines.length > 0 && stdoutLines[stdoutLines.length - 1] === '') {
      stdoutLines.pop();
    }
    for (const line of stdoutLines) {
      experimentParagraphs.push(code(line));
    }
  } catch (err) {
    console.error(`Error running ${exp.codeFile}:`, err.message);
    experimentParagraphs.push(code(`# Error executing script: ${err.message}`));
  }
  experimentParagraphs.push(blank());

  // 10. Conclusion
  if (exp.conclusion) {
    experimentParagraphs.push(dp([B('Conclusion:')]));
    experimentParagraphs.push(dp([R(exp.conclusion)]));
    // experimentParagraphs.push(blank());
  }
}

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
        ...experimentParagraphs,

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
