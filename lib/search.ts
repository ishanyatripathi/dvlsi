import { experiments, Experiment } from './experiments';

export interface SearchResult {
  experiment: Experiment;
  matchedSections: string[];
  relevanceScore: number;
}

const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

export function searchExperiments(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const q = normalize(query.trim());
  const terms = q.split(/\s+/).filter(t => t.length > 1);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const exp of experiments) {
    let score = 0;
    const matchedSections: string[] = [];

    const check = (text: string, section: string, weight: number) => {
      const norm = normalize(text);
      let matched = false;
      for (const term of terms) {
        if (norm.includes(term)) {
          score += weight;
          matched = true;
        }
      }
      if (matched && !matchedSections.includes(section)) {
        matchedSections.push(section);
      }
    };

    // Check experiment number
    if (q.includes(String(exp.number)) || q.includes(`exp-${exp.number.toString().padStart(2, '0')}`)) {
      score += 20;
      matchedSections.push('Overview');
    }

    check(exp.title, 'Overview', 10);
    check(exp.aim, 'Overview', 8);
    check(exp.theory, 'Theory', 4);
    check(exp.procedure.join(' '), 'Procedure', 3);
    check(exp.conclusion, 'Overview', 3);

    if (exp.program) check(exp.program, 'Code', 6);
    if (exp.programTitle) check(exp.programTitle, 'Code', 5);

    if (exp.truthTable) {
      const ttText = [
        ...exp.truthTable.inputHeaders,
        ...exp.truthTable.outputHeaders,
      ].join(' ');
      check(ttText, 'Truth Table', 3);
    }

    for (const vq of exp.vivaQuestions) {
      check(vq.question + ' ' + vq.answer, 'Viva', 2);
    }

    // Type-specific keyword matching
    if (terms.some(t => ['microwind', 'layout', 'cmos', 'pmos', 'nmos', 'mosfet', 'transistor', 'vlsi', 'drc', 'lambda'].includes(t))) {
      if (exp.type === 'microwind') score += 5;
    }
    if (terms.some(t => ['verilog', 'hdl', 'module', 'wire', 'assign', 'always', 'vivado', 'xilinx', 'simulation', 'synthesis'].includes(t))) {
      if (exp.type === 'verilog') score += 5;
    }

    if (score > 0) {
      results.push({ experiment: exp, matchedSections, relevanceScore: score });
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export function getManualContext(experimentId: string, query?: string): string {
  const exp = experiments.find(e => e.id === experimentId);
  if (!exp) return '';

  const parts: string[] = [
    `EXPERIMENT ${exp.number}: ${exp.title}`,
    `AIM: ${exp.aim}`,
    `SOFTWARE: ${exp.software}`,
    `THEORY: ${exp.theory}`,
    `PROCEDURE: ${exp.procedure.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
  ];

  if (exp.discrepancyNote) {
    parts.push(`NOTE: ${exp.discrepancyNote}`);
  }

  if (exp.program) {
    parts.push(`PROGRAM (${exp.programTitle ?? 'Verilog Code'}):\n${exp.program}`);
  }

  if (exp.truthTable) {
    const headers = [...exp.truthTable.inputHeaders, ...exp.truthTable.outputHeaders];
    const rows = exp.truthTable.rows.map(r => {
      const vals = headers.map(h => r.inputs[h] ?? r.outputs[h] ?? '-');
      return vals.join(' | ');
    });
    parts.push(`TRUTH TABLE:\n${headers.join(' | ')}\n${rows.join('\n')}`);
    parts.push(`Truth Table Note: ${exp.truthTable.sourceNote}`);
  }

  if (exp.vivaQuestions.length > 0) {
    const vivas = exp.vivaQuestions.map((vq, i) => `Q${i + 1}: ${vq.question}\nA: ${vq.answer}`).join('\n\n');
    parts.push(`VIVA QUESTIONS:\n${vivas}`);
  }

  parts.push(`CONCLUSION: ${exp.conclusion}`);

  return parts.join('\n\n---\n\n');
}
