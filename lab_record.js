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
// Header Creator
// ──────────────────────────────────────────────────────────────
function createPageHeader(name, rollNumber) {
  return new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `Student Name: ${name}`,
            bold: true, font: 'Verdana', size: 20,
          }),
          new PositionalTabRun(),
          new TextRun({
            text: `Roll No: ${rollNumber}`,
            bold: true, font: 'Verdana', size: 20,
          }),
        ],
      }),
    ],
  });
}

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
    
    if (trimmed.startsWith('#')) {
      continue;
    }
    
    let cleanedLine = line;
    const hashIdx = line.indexOf('#');
    if (hashIdx !== -1) {
      cleanedLine = line.substring(0, hashIdx).trimEnd();
    }
    
    if (cleanedLine.trim() === '') {
      if (processedLines.length > 0 && processedLines[processedLines.length - 1].trim() !== '') {
        processedLines.push('');
      }
      continue;
    }
    
    processedLines.push(cleanedLine);
  }
  
  while (processedLines.length > 0 && processedLines[processedLines.length - 1].trim() === '') {
    processedLines.pop();
  }
  
  return processedLines;
}

// ──────────────────────────────────────────────────────────────
// Input Customization Logic per Student
// ──────────────────────────────────────────────────────────────
function modifyInputs(expId, codeRaw, studentIndex) {
  let modifiedCode = codeRaw;
  const offset = studentIndex;
  
  switch(expId) {
    case 1: {
      const newCostMatrix = `cost_matrix = [
    [${9 + offset}, ${2 + offset}, ${7 + offset}, ${8 + offset}],
    [${6 + offset}, ${4 + offset}, ${3 + offset}, ${7 + offset}],
    [${5 + offset}, ${8 + offset}, ${1 + offset}, ${8 + offset}],
    [${7 + offset}, ${6 + offset}, ${9 + offset}, ${4 + offset}]
]`;
      modifiedCode = modifiedCode.replace(/cost_matrix\s*=\s*\[\s*\[[^\]]+\](?:,\s*\[[^\]]+\])*\s*\]/m, newCostMatrix);
      break;
    }
    case 2: {
      const scale = studentIndex * 11;
      modifiedCode = modifiedCode.replace(/x\s*=\s*\d+/, `x = ${4321 + scale}`);
      modifiedCode = modifiedCode.replace(/y\s*=\s*\d+/, `y = ${8765 - scale}`);
      break;
    }
    case 3: {
      const scale = studentIndex * 5;
      modifiedCode = modifiedCode.replace(/values\s*=\s*\[\s*60,\s*100,\s*120\s*\]/, `values = [${60 + scale}, ${100 + scale}, ${120 + scale}]`);
      modifiedCode = modifiedCode.replace(/capacity\s*=\s*50/, `capacity = ${50 + studentIndex}`);
      break;
    }
    case 4: {
      modifiedCode = modifiedCode.replace(/b\s*=\s*\[\s*8,\s*-11,\s*-3\s*\]/, `b = [${8 + offset}, ${-11 + offset}, ${-3 - offset}]`);
      break;
    }
    case 5: {
      modifiedCode = modifiedCode.replace(/A\s*=\s*np\.array\(\s*\[\s*\[4,\s*3\], \s*\[6,\s*3\]\s*\]\s*\)/, `A = np.array([[${4 + offset}, ${3 + offset}], [6, ${3 - offset}]])`);
      break;
    }
    case 6: {
      let newGraph;
      if (studentIndex % 3 === 0) {
        newGraph = `graph = [
    [0, 1, 1],
    [0, 0, 1],
    [1, 0, 0]
]`;
      } else if (studentIndex % 3 === 1) {
        newGraph = `graph = [
    [0, 1, 0],
    [1, 0, 1],
    [1, 0, 0]
]`;
      } else {
        newGraph = `graph = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0]
]`;
      }
      modifiedCode = modifiedCode.replace(/graph\s*=\s*\[\s*\[[^\]]+\](?:,\s*\[[^\]]+\])*\s*\]/m, newGraph);
      break;
    }
    case 7: {
      let newText = "ABABDABACDABABCABAB";
      let newPattern = "ABABCABAB";
      if (studentIndex === 1) {
        newText = "CBABDABACDABABCABAB";
      } else if (studentIndex === 2) {
        newText = "ABABDABACDABADCABAB";
        newPattern = "ABADCABAB";
      } else if (studentIndex === 3) {
        newText = "ABABDABACDABABCACAB";
        newPattern = "ABABCACAB";
      } else if (studentIndex === 4) {
        newText = "ABABFABACDABABCABAB";
        newPattern = "ABABCABAB";
      } else if (studentIndex === 5) {
        newText = "ABABDABACDABABCABAC";
        newPattern = "ABABCABAC";
      }
      modifiedCode = modifiedCode.replace(/text\s*=\s*".*?"/, `text = "${newText}"`);
      modifiedCode = modifiedCode.replace(/pattern\s*=\s*".*?"/, `pattern = "${newPattern}"`);
      break;
    }
    case 8: {
      let newPattern = "ABABCABB";
      if (studentIndex === 1) newPattern = "ABABCABA";
      else if (studentIndex === 2) newPattern = "ABABDABA";
      else if (studentIndex === 3) newPattern = "ABACDABA";
      else if (studentIndex === 4) newPattern = "DABABCAB";
      else if (studentIndex === 5) newPattern = "CDABABC";
      modifiedCode = modifiedCode.replace(/pattern\s*=\s*".*?"/, `pattern = "${newPattern}"`);
      break;
    }
    case 9: {
      const baseArr = [12, 11, 13, 5, 6, 7];
      const newArr = baseArr.map(val => val + studentIndex * 3);
      modifiedCode = modifiedCode.replace(/arr\s*=\s*\[.*?\]/, `arr = [${newArr.join(', ')}]`);
      break;
    }
    case 10: {
      const newCapacity = `capacity = [
    [0, ${16 + offset}, ${13 - offset}, 0, 0, 0],
    [0, 0, ${10 + offset}, ${12 - offset}, 0, 0],
    [0, 4, 0, 0, ${14 + offset}, 0],
    [0, 0, ${9 - offset}, 0, 0, ${20 + offset}],
    [0, 0, 0, 7, 0, ${4 + offset}],
    [0, 0, 0, 0, 0, 0]
]`;
      modifiedCode = modifiedCode.replace(/capacity\s*=\s*\[\s*\[[^\]]+\](?:,\s*\[[^\]]+\])*\s*\]/m, newCapacity);
      break;
    }
  }
  return modifiedCode;
}

// ──────────────────────────────────────────────────────────────
// Last Page Layout Helpers
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
// Batch Generation Function
// ──────────────────────────────────────────────────────────────
const parsedExps = parseMarkdown('lab_record_clean.md');

function generateDocumentForStudent(name, rollNumber, studentIndex) {
  const pageHeader = createPageHeader(name, rollNumber);
  const experimentParagraphs = [];
  
  for (const exp of parsedExps) {
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

    // 6. Python Code (Read, Customize Inputs, Format)
    const codeRaw = fs.readFileSync(exp.codeFile, 'utf8');
    const codeModified = modifyInputs(exp.id, codeRaw, studentIndex);
    const codeLinesClean = processPythonCode(codeModified);
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

    // 9. Output lines (Execute temp customized script and capture stdout)
    const tempFile = `temp_aa_exp${exp.id}_${studentIndex}.py`;
    try {
      fs.writeFileSync(tempFile, codeModified, 'utf8');
      const stdout = execSync(`python ${tempFile}`, { encoding: 'utf8' });
      const stdoutLines = stdout.split(/\r?\n/);
      if (stdoutLines.length > 0 && stdoutLines[stdoutLines.length - 1] === '') {
        stdoutLines.pop();
      }
      for (const line of stdoutLines) {
        experimentParagraphs.push(code(line));
      }
    } catch (err) {
      console.error(`Error running ${tempFile}:`, err.message);
      experimentParagraphs.push(code(`# Error executing script: ${err.message}`));
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
    experimentParagraphs.push(blank());

    // 10. Conclusion
    if (exp.conclusion) {
      experimentParagraphs.push(dp([B('Conclusion:')]));
      experimentParagraphs.push(dp([R(exp.conclusion)]));
    }
  }

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
          new Paragraph({ children: [new PageBreak()] }),
          ...lastPage,
        ],
      },
    ],
  });

  doc.settings.root.push(new BordersDoNotSurroundHeader());
  doc.settings.root.push(new BordersDoNotSurroundFooter());

  return Packer.toBuffer(doc).then((buffer) => {
    const fileName = `./outputs/ADS LAB RECORD ${rollNumber}-${name}.docx`;
    fs.writeFileSync(fileName, buffer);
    console.log(`✅  ${fileName} written successfully!`);
  });
}

// ──────────────────────────────────────────────────────────────
// Main Loop Execution
// ──────────────────────────────────────────────────────────────
const students = [
  { rollNumber: '257Y1D5801', name: 'Anam Koteswari' },
  { rollNumber: '257Y1D5802', name: 'Gangidi Gyaneshwar Reddy' },
  { rollNumber: '257Y1D5803', name: 'Madamanchi Krishna Varun' },
  { rollNumber: '257Y1D5804', name: 'Munagavalasa Sagar Chandra Patnaik' },
  { rollNumber: '257Y1D5805', name: 'Srinivas Rao Tammireddy' },
  { rollNumber: '257Y1D5806', name: 'Harthika Rayala' }
];

async function run() {
  for (let idx = 0; idx < students.length; idx++) {
    const student = students[idx];
    await generateDocumentForStudent(student.name, student.rollNumber, idx);
  }
  console.log("🎉 All student record files have been successfully compiled with unique inputs!");
}

run().catch(console.error);
