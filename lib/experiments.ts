// Experiment data extracted verbatim from the Digital VLSI Lab Manual
// Course: Digital VLSI (ETPCL502), TE Semester V
// DO NOT silently rewrite manual content.

export type ExperimentType = 'microwind' | 'verilog';

export interface TruthTableRow {
  inputs: Record<string, string>;
  outputs: Record<string, string>;
}

export interface TruthTable {
  inputHeaders: string[];
  outputHeaders: string[];
  rows: TruthTableRow[];
  sourceNote: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface Experiment {
  id: string;
  number: number;
  title: string; // Exact title from the index
  aim: string;   // Exact AIM from the experiment page
  type: ExperimentType;
  software: string;
  section: 'A' | 'B' | 'C';
  sectionLabel: string;
  discrepancyNote?: string; // Flag if index title differs from experiment content
  algorithm?: string;
  theory: string;
  procedure: string[];
  program?: string; // Verilog code as written in the manual
  programTitle?: string; // Exact heading used for the program in the manual
  conclusion: string;
  truthTable?: TruthTable;
  vivaQuestions: VivaQuestion[];
  manualPages: number[];
}

export const experiments: Experiment[] = [
  {
    id: 'exp-01',
    number: 1,
    title: 'NMOS Inverter',
    aim: 'To design and simulate the layout of NMOS Inverter using Microwind',
    type: 'microwind',
    software: 'Microwind',
    section: 'A',
    sectionLabel: 'CMOS LAYOUTS',
    theory: `NMOS Inverter with saturated load is as shown in figure. Enhancement NMOS is used as Driver and saturated Enhancement NMOS is used as Load in the figure shown below.

The NMOS inverter uses a depletion-mode NMOS transistor as the load and an enhancement-mode NMOS transistor as the driver. When the input (Vin) is HIGH (logic 1), the driver NMOS turns ON and pulls the output LOW. When Vin is LOW (logic 0), the driver NMOS is OFF and the load NMOS (connected as a diode with gate shorted to drain) pulls the output HIGH — but not to full VDD, resulting in a reduced voltage swing. This is a key limitation compared to CMOS inverters.`,
    procedure: [
      'Select a new foundry by clicking on File → Select Foundry.',
      'Fix the left corner to be 1λ = 0.06µm.',
      'Select the metal1 (BLUE Color) from the palette to create metal layer of width 3λ minimum at Top for VDD Supply and at Bottom for Ground VCC Connection.',
      'Select the n+ diffusion (GREEN Color) of width 2λ minimum. Draw from top to bottom to form the source and drain terminal. It should overlap the metal to form the contacts.',
      'Select polysilicon layer (RED Color) of width 2λ minimum for the gate terminal of MOSFET. For Load NMOS overlap it on metal to put contact. Put it across N+ diffusion to create NMOS Driver gate and to apply input.',
      'Output is taken from the common point of Load and Driver NMOS MOSFET.',
      'Now Assign the Vdd supply (5 volt) to the upper metal layer and Vcc to lower metal plate.',
      'Assign the input by using clock pulse (Give your name) to the polysilicon left side of Driver (mark it visible in simulation). Clock pulse lower and higher outputs should be 0v to 5V.',
      'Assign the clock input variable option as output with your name and mark it as visible in simulation.',
      'Check for any design errors using DRC. In case of errors remove it.',
      'Save and simulate to observe the THREE output waveforms Voltage vs Time, Current vs Time and Voltage vs Voltage (VTC).',
    ],
    conclusion: 'Student has to Comment on Voltage swing, Current flow and VTC not reaching ground.',
    truthTable: {
      inputHeaders: ['A (Input)'],
      outputHeaders: ['Y (Output)'],
      rows: [
        { inputs: { 'A (Input)': '0 (0V)' }, outputs: { 'Y (Output)': '1 (~4V, not full VDD)' } },
        { inputs: { 'A (Input)': '1 (5V)' }, outputs: { 'Y (Output)': '0 (0V)' } },
      ],
      sourceNote: 'Standard NMOS inverter behaviour — verify against your simulation waveform.',
    },
    vivaQuestions: [
      {
        question: 'What is the function of the load NMOS transistor in an NMOS inverter?',
        answer: 'The load NMOS transistor (connected with gate shorted to drain in saturation mode) acts as a pull-up device. It provides a current path to VDD when the driver NMOS is OFF, pulling the output HIGH.',
      },
      {
        question: 'Why does the output of an NMOS inverter not reach VDD?',
        answer: 'The load NMOS has a threshold voltage drop (Vth) across it. Since its gate is connected to its drain (diode configuration), the output can only rise to VDD − Vth, not to the full supply voltage.',
      },
      {
        question: 'What is λ (lambda) in Microwind layout design?',
        answer: 'λ (lambda) is the half-pitch of the minimum feature size. In this experiment, 1λ = 0.06µm. It is used as a normalized unit so that layout rules can scale across process technologies.',
      },
      {
        question: 'What is the VTC (Voltage Transfer Characteristic)?',
        answer: 'The VTC is a plot of output voltage (Vout) vs. input voltage (Vin). It shows the switching threshold, noise margins, and the regions where the transistors operate in saturation and linear modes.',
      },
      {
        question: 'What is DRC in Microwind?',
        answer: 'DRC stands for Design Rule Check. It verifies that the layout conforms to the process technology design rules (minimum widths, spacings, overlaps), preventing manufacturing defects.',
      },
    ],
    manualPages: [5, 6],
  },

  {
    id: 'exp-02',
    number: 2,
    title: 'CMOS Inverter',
    aim: 'To design and simulate the layout of CMOS Inverter using Microwind',
    type: 'microwind',
    software: 'Microwind',
    section: 'A',
    sectionLabel: 'CMOS LAYOUTS',
    theory: `CMOS Inverter is as shown in figure. Here PMOS is used as Driver and NMOS is used as Load. Input is applied to Gate terminal of both MOSFET as shown below.

A CMOS inverter consists of a complementary pair: a PMOS transistor (pull-up network) and an NMOS transistor (pull-down network) with their drains connected together as the output, and their gates tied together as the input.

When input is LOW (0V): PMOS turns ON (gate-source voltage = -VDD), NMOS turns OFF → Output is pulled to VDD (logic HIGH).
When input is HIGH (VDD): PMOS turns OFF, NMOS turns ON → Output is pulled to GND (logic LOW).

Key advantages over NMOS-only inverter:
- Full voltage swing (0 to VDD)
- No static power dissipation (only one transistor conducts at a time)
- Better noise margins`,
    procedure: [
      'Select a new foundry by clicking on File → Select Foundry.',
      'Fix the left corner to be 1λ = 0.06µm.',
      'Select the metal1 (BLUE Color) from the palette to create metal layer of width 3λ minimum at Top for VDD Supply and at Bottom for Ground VCC Connection.',
      'Select the p+ diffusion (YELLOW Color) of width 2λ minimum. Draw from top to middle to form the PMOS. It should overlap the metal to form the contacts.',
      'Put the N-Well covering PMOS and assign separate VDD to it with 5 volt. It should not overlap on Metal VDD otherwise it will short and circuit will not function.',
      'Select the n+ diffusion (GREEN Color) of width 2λ minimum. Draw from middle to bottom to form the NMOS. It should overlap the metal to form the contacts.',
      'Select polysilicon layer (RED Color) of width 2λ minimum for the gate terminal of MOSFET. Put it across N+ diffusion to create NMOS Driver gate and to apply input.',
      'Output is taken from the common point of Load and Driver NMOS MOSFET.',
      'Now Assign the Vdd supply (5 volt) to the upper metal layer and Vcc to lower metal plate.',
      'Assign the input by using clock pulse (Give your name) to the polysilicon left side of Driver (mark it visible in simulation). Clock pulse lower and higher outputs should be 0v to 5V.',
      'Assign the clock input variable option as output with your name and mark it as visible in simulation.',
      'Check for any design errors using DRC. In case of errors remove it.',
      'Save and simulate to observe the THREE output waveforms Voltage vs Time, Current vs Time and Voltage vs Voltage (VTC).',
    ],
    conclusion: 'Student has to Comment on Voltage swing, Current flow and VTC not reaching ground.',
    truthTable: {
      inputHeaders: ['A (Input)'],
      outputHeaders: ['Y (Output)'],
      rows: [
        { inputs: { 'A (Input)': '0 (0V)' }, outputs: { 'Y (Output)': '1 (VDD = 5V)' } },
        { inputs: { 'A (Input)': '1 (5V)' }, outputs: { 'Y (Output)': '0 (GND = 0V)' } },
      ],
      sourceNote: 'Standard CMOS inverter truth table. Full voltage swing (0 to VDD) is expected.',
    },
    vivaQuestions: [
      {
        question: 'Why is CMOS technology preferred over NMOS for logic circuits?',
        answer: 'CMOS dissipates negligible static power because both PMOS and NMOS cannot be ON simultaneously under DC conditions. NMOS-only circuits dissipate continuous static current through the load transistor. CMOS also provides full voltage swing (0 to VDD), better noise margins, and higher packing density.',
      },
      {
        question: 'What is the role of the N-Well in CMOS layout?',
        answer: 'The N-Well is a region doped with N-type impurities in a P-type substrate. PMOS transistors are fabricated inside the N-Well because they require an N-type body. The N-Well must be connected to VDD (highest potential) to ensure its p-n junction with the substrate remains reverse-biased.',
      },
      {
        question: 'What happens at the switching threshold of a CMOS inverter?',
        answer: 'At the switching threshold (Vm), both PMOS and NMOS are simultaneously in saturation. A large transient current flows briefly from VDD to GND. Vm = VDD/2 for a symmetric inverter (where kn = kp).',
      },
      {
        question: 'Compare CMOS inverter with NMOS inverter.',
        answer: 'CMOS: Full voltage swing, no static power, better noise margins, requires two transistor types, needs N-Well. NMOS inverter: Output cannot reach VDD (Vth drop across load), static power dissipation, simpler fabrication but worse performance.',
      },
      {
        question: 'What are noise margins and why are they important?',
        answer: 'Noise margins (NMH and NML) quantify how much noise a logic gate can tolerate while still correctly interpreting its input. NMH = VOH - VIH and NML = VIL - VOL. CMOS has excellent noise margins (approximately VDD/2 each) because of its full voltage swing.',
      },
    ],
    manualPages: [7, 8],
  },

  {
    id: 'exp-03',
    number: 3,
    title: 'CMOS NAND Gate',
    aim: 'To design and simulate the layout of 2 input CMOS NAND gate using Microwind',
    type: 'microwind',
    software: 'Microwind',
    section: 'A',
    sectionLabel: 'CMOS LAYOUTS',
    theory: `NAND gate implemented by using two CMOS inverter is shown in diagram. Here two NMOS are connected in series and PMOS are connected in parallel. This connection functions as NAND gate. Truth Table is mentioned here which has to be filled by students and verify it in simulation.

In a CMOS NAND gate:
- Pull-down network (PDN): Two NMOS transistors in SERIES (output goes LOW only when BOTH inputs are HIGH).
- Pull-up network (PUN): Two PMOS transistors in PARALLEL (output goes HIGH when ANY input is LOW).

This is the dual/complement of the pull-down network, which is a fundamental rule of CMOS gate design using Euler's path.`,
    procedure: [
      'Use the steps to form PMOS and NMOS as used in experiment 1 and 2.',
      'Here 2 PMOS are in parallel and 2 NMOS are in series — make sure the contacts are used correctly.',
      'Avoid any wrong overlap and wrong contacts.',
      'Put correct N-Well across both PMOS.',
      'Assign Voltages.',
      'Assign inputs with your names.',
      'Assign the clock input variable option as output with your name and mark it as visible in simulation.',
      'Check for any design errors using DRC. In case of errors remove it.',
      'Save and simulate to observe the THREE output waveforms Voltage vs Time, Current vs Time and Voltage vs Voltage (VTC).',
      'Observe only Voltage vs Time waveform to check all four conditions are correct. If not then redo it till Truth Table is verified.',
    ],
    conclusion: 'The CMOS NAND gate layout was designed and simulated. The Truth Table was verified from the waveform.',
    truthTable: {
      inputHeaders: ['A', 'B'],
      outputHeaders: ['Y = NAND(A,B)'],
      rows: [
        { inputs: { A: '0', B: '0' }, outputs: { 'Y = NAND(A,B)': '1' } },
        { inputs: { A: '0', B: '1' }, outputs: { 'Y = NAND(A,B)': '1' } },
        { inputs: { A: '1', B: '0' }, outputs: { 'Y = NAND(A,B)': '1' } },
        { inputs: { A: '1', B: '1' }, outputs: { 'Y = NAND(A,B)': '0' } },
      ],
      sourceNote: 'Standard 2-input CMOS NAND truth table. Students must verify against simulation waveforms.',
    },
    vivaQuestions: [
      {
        question: 'Why are NMOS transistors connected in series and PMOS in parallel for a NAND gate?',
        answer: 'For NAND: Output is LOW only when ALL inputs are HIGH. Series NMOS creates AND logic in the pull-down path — both must be ON to pull output to GND. Parallel PMOS creates OR logic in the pull-up path — any OFF PMOS allows output to be pulled HIGH.',
      },
      {
        question: 'What is the duality principle in CMOS design?',
        answer: 'The CMOS duality principle states that the PMOS pull-up network (PUN) is the topological dual of the NMOS pull-down network (PDN). Where PDN has series connection, PUN has parallel, and vice versa. This ensures complementary logic operation.',
      },
      {
        question: 'Why is NAND preferred over NOR in CMOS implementation?',
        answer: 'NAND is preferred because NMOS transistors have higher mobility (carrier speed) than PMOS. In NAND, NMOS are in series (slower) and PMOS are in parallel (faster). In NOR, PMOS are in series (even slower). Since NMOS is already faster, putting the slower PMOS in series (NOR) degrades performance more.',
      },
    ],
    manualPages: [9, 10],
  },

  {
    id: 'exp-04',
    number: 4,
    title: 'CMOS NOR Gate',
    aim: 'To design and simulate the layout of 2 input CMOS NOR gate using Microwind',
    type: 'microwind',
    software: 'Microwind',
    section: 'A',
    sectionLabel: 'CMOS LAYOUTS',
    theory: `NOR gate implemented by using two CMOS inverter is shown in diagram. Here two PMOS are connected in series and NMOS are connected in parallel. This connection functions as NOR gate. Truth Table is mentioned here which has to be filled by student and verify it in simulation.

In a CMOS NOR gate:
- Pull-down network (PDN): Two NMOS transistors in PARALLEL (output goes LOW when ANY input is HIGH).
- Pull-up network (PUN): Two PMOS transistors in SERIES (output goes HIGH only when ALL inputs are LOW).

This is the dual of the NAND gate network arrangement.`,
    procedure: [
      'Use the steps to form PMOS and NMOS as used in experiment 1 and 2.',
      'Here 2 PMOS are in series and 2 NMOS are in parallel — make sure the contacts are used correctly.',
      'Avoid any wrong overlap and wrong contacts.',
      'Put correct N-Well across both PMOS.',
      'Assign Voltages.',
      'Assign inputs with your names.',
      'Assign the clock input variable option as output with your name and mark it as visible in simulation.',
      'Check for any design errors using DRC. In case of errors remove it.',
      'Save and simulate to observe the THREE output waveforms Voltage vs Time, Current vs Time and Voltage vs Voltage (VTC).',
      'Observe only Voltage vs Time waveform to check all four conditions are correct. If not then redo it till Truth Table is verified.',
    ],
    conclusion: 'The CMOS NOR gate layout was designed and simulated. The Truth Table was verified from the waveform.',
    truthTable: {
      inputHeaders: ['A', 'B'],
      outputHeaders: ['Y = NOR(A,B)'],
      rows: [
        { inputs: { A: '0', B: '0' }, outputs: { 'Y = NOR(A,B)': '1' } },
        { inputs: { A: '0', B: '1' }, outputs: { 'Y = NOR(A,B)': '0' } },
        { inputs: { A: '1', B: '0' }, outputs: { 'Y = NOR(A,B)': '0' } },
        { inputs: { A: '1', B: '1' }, outputs: { 'Y = NOR(A,B)': '0' } },
      ],
      sourceNote: 'Standard 2-input CMOS NOR truth table. Students must verify against simulation waveforms.',
    },
    vivaQuestions: [
      {
        question: 'Why are PMOS transistors in series and NMOS in parallel for a NOR gate?',
        answer: 'For NOR: Output is HIGH only when ALL inputs are LOW. Series PMOS creates AND logic in the pull-up path — both PMOS must be ON (both inputs LOW) to pull output HIGH. Parallel NMOS creates OR logic in the pull-down path — any ON NMOS pulls output LOW.',
      },
      {
        question: 'What are the disadvantages of CMOS NOR compared to CMOS NAND?',
        answer: 'NOR has series PMOS transistors, which are inherently slower than NMOS due to lower hole mobility. To match drive strength, PMOS transistors in NOR must be sized wider (W/L ratio increased), consuming more area. NAND is generally preferred for performance-critical design.',
      },
    ],
    manualPages: [11, 12],
  },

  {
    id: 'exp-05',
    number: 5,
    title: 'Complex CMOS Gate',
    aim: 'To design and simulate the layout of the Boolean function F=/(A.B + C) using CMOS using Microwind',
    type: 'microwind',
    software: 'Microwind',
    section: 'A',
    sectionLabel: 'CMOS LAYOUTS',
    theory: `Function F implemented by using two CMOS inverter is shown in diagram. Here PMOS and NMOS are connected in series/parallel as per Euler's path. This connection functions as the Boolean expression F = /(A.B + C).

Boolean Expression: F = /(A·B + C)  ≡  NOT(AND(A,B) OR C)

This is a two-level logic function requiring:
- Pull-down network (PDN): A and B in series (for AND term), this series combination in parallel with C.
- Pull-up network (PUN): The topological dual — A and B in parallel, this combination in series with C (PMOS logic).

Euler's path method is used to determine the optimal transistor ordering to minimise the layout area and routing complexity.`,
    procedure: [
      'Use the steps to form PMOS and NMOS as used in experiment 1 and 2.',
      'Here PMOS and NMOS are in parallel and in series as per Euler\'s design concept.',
      'Avoid any wrong overlap and wrong contacts.',
      'Put correct N-Well across PMOS.',
      'Assign Voltages.',
      'Assign inputs with your names.',
      'Assign the clock input variable option as output with your name and mark it as visible in simulation.',
      'Check for any design errors using DRC. In case of errors remove it.',
      'Save and simulate to observe the Voltage vs Time waveform (VTC).',
      'Observe the various cases of Truth Table in Voltage vs Time waveform and mark them on printout.',
    ],
    conclusion: 'The Complex CMOS gate implementing F=/(A.B + C) was designed and simulated using Microwind.',
    truthTable: {
      inputHeaders: ['A', 'B', 'C'],
      outputHeaders: ['A·B', 'A·B + C', 'F = /(A·B + C)'],
      rows: [
        { inputs: { A: '0', B: '0', C: '0' }, outputs: { 'A·B': '0', 'A·B + C': '0', 'F = /(A·B + C)': '1' } },
        { inputs: { A: '0', B: '0', C: '1' }, outputs: { 'A·B': '0', 'A·B + C': '1', 'F = /(A·B + C)': '0' } },
        { inputs: { A: '0', B: '1', C: '0' }, outputs: { 'A·B': '0', 'A·B + C': '0', 'F = /(A·B + C)': '1' } },
        { inputs: { A: '0', B: '1', C: '1' }, outputs: { 'A·B': '0', 'A·B + C': '1', 'F = /(A·B + C)': '0' } },
        { inputs: { A: '1', B: '0', C: '0' }, outputs: { 'A·B': '0', 'A·B + C': '0', 'F = /(A·B + C)': '1' } },
        { inputs: { A: '1', B: '0', C: '1' }, outputs: { 'A·B': '0', 'A·B + C': '1', 'F = /(A·B + C)': '0' } },
        { inputs: { A: '1', B: '1', C: '0' }, outputs: { 'A·B': '1', 'A·B + C': '1', 'F = /(A·B + C)': '0' } },
        { inputs: { A: '1', B: '1', C: '1' }, outputs: { 'A·B': '1', 'A·B + C': '1', 'F = /(A·B + C)': '0' } },
      ],
      sourceNote: 'Truth table derived from Boolean expression F=/(A.B + C). Verify against simulation waveforms.',
    },
    vivaQuestions: [
      {
        question: 'How do you derive the pull-up and pull-down networks for F=/(A.B + C)?',
        answer: 'The pull-down network (PDN) implements the logic function directly using NMOS: (A series B) in parallel with C. The pull-up network (PUN) is the complement using PMOS: (A parallel B) in series with C. The output is always inverted in CMOS, giving the NAND-based expression.',
      },
      {
        question: 'What is Euler\'s path in CMOS layout design?',
        answer: 'Euler\'s path is an uninterrupted path through the transistor network graph that traverses every edge (transistor) exactly once. Finding an Euler path common to both PDN and PUN allows transistors to be ordered such that they share diffusion regions, minimizing the number of breaks in diffusion strips and thus reducing layout area.',
      },
    ],
    manualPages: [13, 14],
  },

  {
    id: 'exp-06',
    number: 6,
    title: 'Basic Logic Gates',
    aim: 'To write a Verilog program for basic logic gates to synthesize and simulate using Xilinx',
    type: 'verilog',
    software: 'Vivado 2025',
    section: 'B',
    sectionLabel: 'VERILOG HDL',
    algorithm: `1. Start the program.
2. Declare the input and output variables.
3. Declare the output as register data type.
4. Use PROCEDURAL construct statements (behavioral modeling) for Verilog code.
5. Write the functionality of the gates.
6. Terminate the program.`,
    theory: `Students has to write their Boolean expression of various gates mentioned below:

AND Gate Boolean expression Y = a & b
NOT Gate Boolean expression P = ~a
OR Gate Boolean expression Z = a | b
NAND Gate Boolean expression Q = ~(a & b)
NOR Gate Boolean expression M = ~(a | b)
EXOR Gate Boolean expression S = a ^ b
EXNOR Gate Boolean expression R = ~(a ^ b)

Verilog operators for various gates:
- AND GATE: Y = a & b
- OR GATE: Z = a | b
- NOT GATE: P = ~a
- NAND GATE: Q = ~(a & b)
- NOR GATE: M = ~(a | b)
- EX-OR GATE: S = a ^ b
- EX-NOR GATE: R = ~(a ^ b)`,
    procedure: [
      'Click on the Vivado Project navigator icon on the desktop.',
      'Write the Verilog code by choosing HDL as top level source module.',
      'Check syntax, view RTL schematic and note the device utilization summary by double clicking on the synthesis in the process window.',
      'Perform the functional simulation.',
      'Observe the output.',
    ],
    program: `module logicgates(a,b,c,d,e,f,g,h);
input a,b;
output c,d,e,f,g,h;
and(c,a,b);
or(d,a,b);
not(e,a);
nand(f,a,b);
xor(g,a,b);
xnor(h,a,b); 
endmodule`,
    programTitle: 'Verilog Code for basic logic gates',
    conclusion: 'The Verilog program for seven logic gates written, synthesized, simulated and TT verified.',
    truthTable: {
      inputHeaders: ['A', 'B'],
      outputHeaders: ['NOT (P=~A)', 'AND (Y=A&B)', 'OR (Z=A|B)', 'NAND (Q=~(A&B))', 'NOR (M=~(A|B))', 'EXOR (S=A^B)', 'EXNOR (R=~(A^B))'],
      rows: [
        { inputs: { A: '0', B: '0' }, outputs: { 'NOT (P=~A)': '1', 'AND (Y=A&B)': '0', 'OR (Z=A|B)': '0', 'NAND (Q=~(A&B))': '1', 'NOR (M=~(A|B))': '1', 'EXOR (S=A^B)': '0', 'EXNOR (R=~(A^B))': '1' } },
        { inputs: { A: '0', B: '1' }, outputs: { 'NOT (P=~A)': '1', 'AND (Y=A&B)': '0', 'OR (Z=A|B)': '1', 'NAND (Q=~(A&B))': '1', 'NOR (M=~(A|B))': '0', 'EXOR (S=A^B)': '1', 'EXNOR (R=~(A^B))': '0' } },
        { inputs: { A: '1', B: '0' }, outputs: { 'NOT (P=~A)': '0', 'AND (Y=A&B)': '0', 'OR (Z=A|B)': '1', 'NAND (Q=~(A&B))': '1', 'NOR (M=~(A|B))': '0', 'EXOR (S=A^B)': '1', 'EXNOR (R=~(A^B))': '0' } },
        { inputs: { A: '1', B: '1' }, outputs: { 'NOT (P=~A)': '0', 'AND (Y=A&B)': '1', 'OR (Z=A|B)': '1', 'NAND (Q=~(A&B))': '0', 'NOR (M=~(A|B))': '0', 'EXOR (S=A^B)': '0', 'EXNOR (R=~(A^B))': '1' } },
      ],
      sourceNote: 'Standard truth table for seven basic logic gates. The NOT gate output (P) uses only input A.',
    },
    vivaQuestions: [
      {
        question: 'What is the difference between structural, dataflow, and behavioral modeling in Verilog?',
        answer: 'Structural: Uses primitive gates and module instances (like in the manual\'s code with and(), or(), not()). Dataflow: Uses continuous assignments (assign Y = a & b). Behavioral: Uses always blocks and procedural statements. The manual uses structural/primitive modeling.',
      },
      {
        question: 'What is a module in Verilog?',
        answer: 'A module is the fundamental building block of Verilog design. It encapsulates a design entity with defined inputs, outputs, and internal logic. Modules can be instantiated within other modules, enabling hierarchical design.',
      },
      {
        question: 'Explain the difference between EX-OR and EX-NOR gates.',
        answer: 'EX-OR (XOR): Output is HIGH when inputs are different (odd number of 1s). Expression: S = A ^ B. EX-NOR (XNOR): Output is HIGH when inputs are the same. Expression: R = ~(A ^ B) = A XNOR B. They are complements of each other.',
      },
      {
        question: 'Why is NAND called a universal gate?',
        answer: 'NAND is universal because any Boolean function can be implemented using only NAND gates. NOT can be made by tying NAND inputs together. AND = NAND followed by NAND (NOT). OR = NAND with inverted inputs (by De Morgan\'s theorem). This is also true for NOR gates.',
      },
    ],
    manualPages: [15, 16],
  },

  {
    id: 'exp-07',
    number: 7,
    title: '4:1 Multiplexer',
    aim: 'To write a Verilog program for 4:1 Multiplexer',
    type: 'verilog',
    software: 'Vivado 2025',
    section: 'B',
    sectionLabel: 'VERILOG HDL',
    algorithm: `1. Start the program.
2. Declare the input and output variables.
3. Declare the output as register data type.
4. Use PROCEDURAL construct statements (behavioral modeling) for Verilog code.
5. Terminate the program.`,
    theory: `MULTIPLEXER
A Multiplexer is a Combinational circuit that selects binary information from one of many input lines and directs it to a single output line. The set of selection of a particular line is controlled by selection lines. Normally there are 2n input lines and n selection lines whose bit combinations determine which input is selected.

The 4:1 MUX has four inputs I0, I1, I2 and I3 and select lines S0 and S1. The select lines s0 and s1 are decoded to select a particular AND gate. The outputs of the AND gates are applied to a single OR gate that provides the one line output Y.

Selection Logic:
- S1=0, S0=0 → Y = I0 (t0)
- S1=0, S0=1 → Y = I1 (t1)
- S1=1, S0=0 → Y = I2 (t2)
- S1=1, S0=1 → Y = I3 (t3)

Boolean Expression: Y = s0'·s1'·t0 + s0·s1'·t1 + s0'·s1·t2 + s0·s1·t3`,
    procedure: [
      'Click on the Vivado Project navigator icon on the desktop.',
      'Write the Verilog code by choosing HDL as top level source module.',
      'Check syntax, view RTL schematic and note the device utilization summary by double clicking on the synthesis in the process window.',
      'Perform the functional simulation.',
      'Observe the output.',
    ],
    program: `module mux4to1(s0,s1,t0,t1,t2,t3,out);
input s0,s1,t0,t1,t2,t3;
output out;  
wire s0n,s1n,n1,n2,n3,n4;
not(s0n,s0);
not(s1n,s1);
and(n1,s0n,s1n,t0);
and(n2,s0,s1n,t1);
and(n3,s0n,s1,t2);
and(n4,s0,s1,t3);
or(out,n1,n2,n3,n4);
end module`,
    programTitle: 'Verilog code for Multiplexer',
    conclusion: 'The Verilog program for multiplexer synthesized using Vivado. Truth Table is verified with waveforms.',
    truthTable: {
      inputHeaders: ['S1', 'S0', 'Selected Input'],
      outputHeaders: ['Y (Output)'],
      rows: [
        { inputs: { S1: '0', S0: '0', 'Selected Input': 'I0 (t0)' }, outputs: { 'Y (Output)': 'I0' } },
        { inputs: { S1: '0', S0: '1', 'Selected Input': 'I1 (t1)' }, outputs: { 'Y (Output)': 'I1' } },
        { inputs: { S1: '1', S0: '0', 'Selected Input': 'I2 (t2)' }, outputs: { 'Y (Output)': 'I2' } },
        { inputs: { S1: '1', S0: '1', 'Selected Input': 'I3 (t3)' }, outputs: { 'Y (Output)': 'I3' } },
      ],
      sourceNote: 'Standard 4:1 MUX function table from the lab manual. Y passes the selected input to output.',
    },
    vivaQuestions: [
      {
        question: 'What is a multiplexer? How does it differ from a demultiplexer?',
        answer: 'A Multiplexer (MUX) is a many-to-one selector: it selects one of 2n inputs and routes it to a single output based on n select lines. A Demultiplexer (DEMUX) is the opposite: it routes a single input to one of 2n outputs. MUX = "data selector", DEMUX = "data distributor".',
      },
      {
        question: 'Why does the 4:1 MUX module in the manual use structural modeling?',
        answer: 'The manual uses primitive gates (not, and, or) for structural modeling. This directly maps to hardware gates. A behavioral equivalent using a case statement (always @(*) case({s1,s0})) would be more compact but less directly representative of the gate-level implementation.',
      },
      {
        question: 'What is the purpose of the "wire" declaration in Verilog?',
        answer: 'Wire is a data type in Verilog representing a physical wire or net. It carries values driven by continuous assignments or module outputs. It cannot store state. In the MUX code, s0n, s1n, n1, n2, n3, n4 are intermediate wires connecting the gates.',
      },
      {
        question: 'How can a 4:1 MUX be built from 2:1 MUXes?',
        answer: 'Three 2:1 MUXes can build a 4:1 MUX: First level uses two 2:1 MUXes — one selects between I0/I1, another between I2/I3, both controlled by S0. The second level uses one 2:1 MUX to select between the outputs of the first level, controlled by S1.',
      },
    ],
    manualPages: [17, 18],
  },

  {
    id: 'exp-08',
    number: 8,
    title: '8-Bit Adder',
    // AIM as written in the manual experiment page:
    aim: 'To write a Verilog program for Full Adder',
    type: 'verilog',
    software: 'Vivado 2025',
    section: 'B',
    sectionLabel: 'VERILOG HDL',
    // ⚠️ DISCREPANCY NOTE: The index lists this as "Full Adder" and the AIM says "Full Adder",
    // but the program heading says "Verilog Code for 8 BIT ADDER" and the module implements
    // an 8-bit ripple adder (module adderm with input [7:0] a, b).
    // The conclusion also reads "The Verilog program for 8-Bit Adder were written...".
    // This discrepancy is preserved as-is from the source manual.
    discrepancyNote: `⚠️ DISCREPANCY IN MANUAL: The experiment index and AIM both say "Full Adder", but the program heading says "Verilog Code for 8 BIT ADDER" and the module implements an 8-bit adder (inputs [7:0] a, b) — not a 1-bit Full Adder. The conclusion also says "8-Bit Adder". This discrepancy is preserved exactly as it appears in the source manual (ETPCL502).`,
    algorithm: `1. Start the program.
2. Declare the input and output variables.
3. Declare the output as register data type.
4. Use PROCEDURAL construct statements for Verilog code.
5. Write the functionality of the gates.
6. Terminate the program.`,
    theory: `When you add large numbers carefully together the addition is done digit by digit. In the illustration, two 8-digit binary numbers are being added. The top row contains the first number and the second row the other. Working from the right-hand side, there can be no 'carry' to add to the sum of the first two digits, so a half adder is sufficient. But for the second and subsequent pairs of digits, full adders must be used (any 'carry' is indicated by a f below the adder). The output will be an 8-bit and if the carry is formed that will be shown in cout output value.`,
    procedure: [
      'Click on the Vivado Project navigator icon on the desktop.',
      'Write the Verilog code by choosing HDL as top level source module.',
      'Check syntax, view RTL schematic and note the device utilization summary by double clicking on the synthesis in the process window.',
      'Perform the functional simulation.',
      'Observe the output.',
    ],
    // Program preserved exactly as written in the manual (including formatting artefacts from PDF)
    program: `module adderm(a, b, sum, carry);
input [7:0] a;
input [7:0] b;
output [7:0] sum;
output carry;
wire[8:0] temp;
assign temp=(a+b);
assign sum=temp[7:0];
assign carry=temp[8];
endmodule`,
    programTitle: 'Verilog Code for 8 BIT ADDER',
    conclusion: 'The Verilog program for 8-Bit Adder were written, synthesized and simulated using Xilinx tool.',
    truthTable: {
      inputHeaders: ['A [7:0]', 'B [7:0]'],
      outputHeaders: ['Sum [7:0]', 'Carry'],
      rows: [
        { inputs: { 'A [7:0]': '0000_0000', 'B [7:0]': '0000_0000' }, outputs: { 'Sum [7:0]': '0000_0000', Carry: '0' } },
        { inputs: { 'A [7:0]': '0000_0001', 'B [7:0]': '0000_0001' }, outputs: { 'Sum [7:0]': '0000_0010', Carry: '0' } },
        { inputs: { 'A [7:0]': '1111_1111', 'B [7:0]': '0000_0001' }, outputs: { 'Sum [7:0]': '0000_0000', Carry: '1' } },
        { inputs: { 'A [7:0]': '1010_1010', 'B [7:0]': '0101_0101' }, outputs: { 'Sum [7:0]': '1111_1111', Carry: '0' } },
      ],
      sourceNote: 'Sample input-output combinations for the 8-bit adder. Full simulation waveform required for verification.',
    },
    vivaQuestions: [
      {
        question: 'What is the difference between a Half Adder and Full Adder?',
        answer: 'Half Adder: Adds two single bits (A, B) and produces Sum and Carry. No carry-in input. Full Adder: Adds three bits (A, B, Cin) and produces Sum and Cout. Can be cascaded for multi-bit addition. The 8-bit adder in this experiment chains Full Adders conceptually (the "assign temp = a+b" synthesizes to a ripple-carry or carry-lookahead adder depending on the tool).',
      },
      {
        question: 'What does "assign temp = (a+b)" generate in hardware?',
        answer: 'The synthesis tool translates this dataflow statement into an 8-bit adder circuit — typically a ripple-carry adder or carry-lookahead adder depending on the tool\'s optimization. temp is 9 bits wide ([8:0]) to capture the carry-out (temp[8]).',
      },
      {
        question: 'What is the maximum value that can be represented in 8-bit unsigned binary?',
        answer: '2^8 - 1 = 255 (decimal) = 1111_1111 (binary) = FF (hex). Adding 255 + 1 overflows: sum = 0, carry = 1.',
      },
    ],
    manualPages: [19, 20],
  },

  {
    id: 'exp-09',
    number: 9,
    // Preserved with typo from manual: "Pseduo-NMOS NAND" and "NANAD" in aim
    title: 'Pseudo-NMOS NAND',
    aim: 'To design and Simulate Pseduo-NMOS NANAD logic using Microwind',
    type: 'microwind',
    software: 'Microwind',
    section: 'C',
    sectionLabel: 'ADVANCED CMOS',
    theory: `Pseudo-NMOS NAND logic is as shown in figure. PMOS is grounded and will be always in ON state. Inputs A and B are applied to NMOS in drivers. It functions as NAND gate.

In Pseudo-NMOS logic:
- The PMOS transistor has its gate connected to GND (0V), keeping it permanently ON as a weak pull-up load.
- Two NMOS transistors in series form the pull-down network (driver).
- When A=1 AND B=1: Both NMOS are ON, pull-down dominates → Output LOW.
- Otherwise: At least one NMOS is OFF, PMOS pull-up dominates → Output HIGH (but not full VDD due to PMOS saturation).

Advantage over CMOS NAND: Fewer transistors (3 vs 4), smaller area.
Disadvantage: Static power dissipation (PMOS always ON), reduced voltage swing.`,
    procedure: [
      'Use the steps to form PMOS and NMOS as used in experiment 1 and 2.',
      'Here PMOS gate is grounded and 2 NMOS are in series.',
      'Avoid any wrong overlap and wrong contacts.',
      'Put correct N-Well across PMOS.',
      'Assign Voltages.',
      'Assign inputs with your names.',
      'Assign the clock input variable option as output with your name and mark it as visible in simulation.',
      'Check for any design errors using DRC. In case of errors remove it.',
      'Save and simulate to observe the Voltage vs Time waveform (VTC).',
      'Observe the various cases of Truth Table in Voltage vs Time waveform and mark them on printout.',
    ],
    conclusion: 'The Pseudo-NMOS NAND logic was designed and simulated using Microwind.',
    truthTable: {
      inputHeaders: ['A', 'B'],
      outputHeaders: ['Y (Pseudo-NMOS NAND)'],
      rows: [
        { inputs: { A: '0', B: '0' }, outputs: { 'Y (Pseudo-NMOS NAND)': '1 (high, not full VDD)' } },
        { inputs: { A: '0', B: '1' }, outputs: { 'Y (Pseudo-NMOS NAND)': '1 (high)' } },
        { inputs: { A: '1', B: '0' }, outputs: { 'Y (Pseudo-NMOS NAND)': '1 (high)' } },
        { inputs: { A: '1', B: '1' }, outputs: { 'Y (Pseudo-NMOS NAND)': '0 (low)' } },
      ],
      sourceNote: 'Pseudo-NMOS NAND truth table. Note: HIGH output may not reach full VDD due to PMOS saturation.',
    },
    vivaQuestions: [
      {
        question: 'What is Pseudo-NMOS logic and how does it differ from CMOS?',
        answer: 'Pseudo-NMOS logic uses a single PMOS transistor with gate tied to GND as a permanent pull-up load (always ON). Only NMOS transistors form the logic network. CMOS has complementary PMOS pull-up and NMOS pull-down — both switch with input. Pseudo-NMOS is smaller (fewer transistors) but has static power dissipation.',
      },
      {
        question: 'Why does Pseudo-NMOS have static power dissipation?',
        answer: 'In Pseudo-NMOS, the PMOS load is always ON. When any NMOS in the pull-down network is also ON, there is a DC current path from VDD through PMOS to GND through NMOS. This is unlike CMOS where only one network is ON at a time.',
      },
    ],
    manualPages: [21, 22],
  },

  {
    id: 'exp-10',
    number: 10,
    title: 'Clocked CMOS Inverter',
    aim: 'To design and Simulate Clocked CMOS Inverter using Microwind',
    type: 'microwind',
    software: 'Microwind',
    section: 'C',
    sectionLabel: 'ADVANCED CMOS',
    theory: `Clocked CMOS Inverter is as shown in figure. Clock is applied both in pull up and down section thereby controlling the inverter operation. Input applied to CMOS is inverted when clock is given.

The Clocked CMOS (C²MOS) Inverter consists of:
- A standard CMOS inverter (PMOS + NMOS with input A at their gates)
- An additional PMOS transistor in series with the pull-up PMOS (controlled by CLK)
- An additional NMOS transistor in series with the pull-down NMOS (controlled by CLK)

Operation:
- When CLK = 1: The clocked NMOS is ON and clocked PMOS is OFF. The output can be driven (inverter active).
- When CLK = 0: The clocked NMOS is OFF and clocked PMOS is ON. The output is disconnected (high-impedance / tri-state).

The C²MOS inverter is used in dynamic logic circuits and flip-flops, enabling clock-gated operation.`,
    procedure: [
      'Use the steps to form PMOS and NMOS as used in experiment 1 and 2.',
      'Here PMOS and NMOS are in series.',
      'Avoid any wrong overlap and wrong contacts.',
      'Put correct N-Well across PMOS.',
      'Assign Voltages.',
      'Assign inputs with your names.',
      'Assign the clock input variable option as output with your name and mark it as visible in simulation.',
      'Check for any design errors using DRC. In case of errors remove it.',
      'Save and simulate to observe the Voltage vs Time waveform (VTC).',
      'Observe the various cases of Truth Table in Voltage vs Time waveform and mark them on printout.',
    ],
    conclusion: 'The Clocked CMOS Inverter (C²MOS) was designed and simulated using Microwind.',
    truthTable: {
      inputHeaders: ['CLK', 'A (Input)'],
      outputHeaders: ['Y (Output)'],
      rows: [
        { inputs: { CLK: '0', 'A (Input)': '0' }, outputs: { 'Y (Output)': 'Z (High-Z / tri-state)' } },
        { inputs: { CLK: '0', 'A (Input)': '1' }, outputs: { 'Y (Output)': 'Z (High-Z / tri-state)' } },
        { inputs: { CLK: '1', 'A (Input)': '0' }, outputs: { 'Y (Output)': '1 (VDD)' } },
        { inputs: { CLK: '1', 'A (Input)': '1' }, outputs: { 'Y (Output)': '0 (GND)' } },
      ],
      sourceNote: 'C²MOS Inverter truth table. Z = high-impedance (tri-state). Clock enables/disables the inverter.',
    },
    vivaQuestions: [
      {
        question: 'What is the purpose of adding clock transistors to a CMOS inverter?',
        answer: 'The clock transistors enable clock-gated operation. When CLK=0, both pull-up and pull-down paths are broken simultaneously, putting the output in a high-impedance (tri-state) state. This is used in dynamic logic circuits, transmission gates, and master-slave flip-flops.',
      },
      {
        question: 'What is a tri-state output?',
        answer: 'A tri-state output has three possible states: Logic 0 (driven LOW), Logic 1 (driven HIGH), and High-impedance Z (output disconnected — neither driving HIGH nor LOW). In tri-state, the output can be driven by other circuits on the same bus.',
      },
      {
        question: 'How is C²MOS different from a standard transmission gate?',
        answer: 'A transmission gate (pass gate) passes the input signal directly to the output when enabled. C²MOS inverter inverts the signal when the clock is active. Both provide tri-state capability, but C²MOS is an active inverting stage, while a transmission gate is a bilateral switch.',
      },
    ],
    manualPages: [23, 24],
  },

  {
    id: 'exp-11',
    number: 11,
    title: '2-Bit Comparator',
    aim: 'Write and simulate Verilog code for 2 bit Comparator',
    type: 'verilog',
    software: 'Vivado',
    section: 'C',
    sectionLabel: 'ADVANCED CMOS',
    theory: `A 2-bit magnitude comparator is a combinational logic circuit that compares two 2-bit binary numbers (e.g., A₁A₀ and B₁B₀) to determine their relative magnitude. It outputs three Boolean values: A < B, A = B, and A > B.

Using Karnaugh (K-maps) to simplify the truth table, the minimized logical expressions for the three output conditions are derived from comparing all 16 input combinations (4×4 = 16 combinations for two 2-bit numbers).

Logic Expressions:
- A_eq_B: (A == B)
- A_gt_B: (A > B)
- A_lt_B: (A < B)

The reference Verilog uses dataflow modeling with comparison operators, which the synthesis tool maps to a comparator circuit.`,
    procedure: [
      'Click on the Vivado Project navigator icon on the desktop.',
      'Write the Verilog code by choosing HDL as top level source module.',
      'Check syntax, view RTL schematic and note the device utilization summary.',
      'Perform the functional simulation.',
      'Observe the output.',
    ],
    program: `module comparator_2bit_dataflow ( input wire [1:0] A, B, 
output wire A_gt_B, A_eq_B, A_lt_B ); 
assign A_gt_B = (A > B); 
assign A_eq_B = (A == B); 
assign A_lt_B = (A < B); 
endmodule`,
    programTitle: 'Reference Verilog code',
    conclusion: 'The Verilog code for 2-bit Comparator was written and simulated.',
    truthTable: {
      inputHeaders: ['A[1:0]', 'B[1:0]'],
      outputHeaders: ['A > B', 'A = B', 'A < B'],
      rows: [
        { inputs: { 'A[1:0]': '00 (0)', 'B[1:0]': '00 (0)' }, outputs: { 'A > B': '0', 'A = B': '1', 'A < B': '0' } },
        { inputs: { 'A[1:0]': '00 (0)', 'B[1:0]': '01 (1)' }, outputs: { 'A > B': '0', 'A = B': '0', 'A < B': '1' } },
        { inputs: { 'A[1:0]': '01 (1)', 'B[1:0]': '00 (0)' }, outputs: { 'A > B': '1', 'A = B': '0', 'A < B': '0' } },
        { inputs: { 'A[1:0]': '01 (1)', 'B[1:0]': '01 (1)' }, outputs: { 'A > B': '0', 'A = B': '1', 'A < B': '0' } },
        { inputs: { 'A[1:0]': '10 (2)', 'B[1:0]': '00 (0)' }, outputs: { 'A > B': '1', 'A = B': '0', 'A < B': '0' } },
        { inputs: { 'A[1:0]': '10 (2)', 'B[1:0]': '10 (2)' }, outputs: { 'A > B': '0', 'A = B': '1', 'A < B': '0' } },
        { inputs: { 'A[1:0]': '10 (2)', 'B[1:0]': '11 (3)' }, outputs: { 'A > B': '0', 'A = B': '0', 'A < B': '1' } },
        { inputs: { 'A[1:0]': '11 (3)', 'B[1:0]': '11 (3)' }, outputs: { 'A > B': '0', 'A = B': '1', 'A < B': '0' } },
      ],
      sourceNote: 'Selected rows from the 16-combination 2-bit comparator truth table. Exactly one output is HIGH for each input combination.',
    },
    vivaQuestions: [
      {
        question: 'What are the three outputs of a magnitude comparator and what do they indicate?',
        answer: 'A magnitude comparator has three outputs: A_gt_B (A > B) — HIGH when A is greater than B. A_eq_B (A = B) — HIGH when A and B are equal. A_lt_B (A < B) — HIGH when A is less than B. Exactly one output is HIGH for any given input combination.',
      },
      {
        question: 'How does the 2-bit comparator generalize to an N-bit comparator?',
        answer: 'For N-bit numbers, comparison starts from the MSB (most significant bit). If MSBs differ, the result is determined. If they are equal, comparison continues to the next bit. This iterative logic can be cascaded or implemented with priority encoder logic. The Verilog expression A > B handles this automatically.',
      },
      {
        question: 'Can all three comparator outputs be HIGH simultaneously?',
        answer: 'No. For any input combination, exactly one of A_gt_B, A_eq_B, A_lt_B is HIGH and the other two are LOW. They are mutually exclusive and collectively exhaustive outputs.',
      },
    ],
    manualPages: [25, 26],
  },

  {
    id: 'exp-12',
    number: 12,
    title: '2-Bit Multiplier',
    aim: 'Write and simulate Verilog code for 2 bit Multiplier',
    type: 'verilog',
    software: 'Vivado',
    section: 'C',
    sectionLabel: 'ADVANCED CMOS',
    theory: `A 2-bit multiplier is a digital logic circuit that multiplies two 2-bit binary inputs, resulting in a 4-bit output. It is constructed using four 2-input AND gates to compute partial products and two half-adders to sum them.

Multiplication of A[1:0] × B[1:0]:
- Partial Products:
  - P0 = A[0] & B[0]    (LSB)
  - P1a = A[1] & B[0]
  - P1b = A[0] & B[1]
  - P2 = A[1] & B[1]
- The partial products are summed with half-adders to produce a 4-bit result Product[3:0].
- Maximum result: 3 × 3 = 9 (decimal) = 1001 (binary), which fits in 4 bits.`,
    procedure: [
      'Click on the Vivado Project navigator icon on the desktop.',
      'Write the Verilog code by choosing HDL as top level source module.',
      'Check syntax, view RTL schematic and note the device utilization summary.',
      'Perform the functional simulation.',
      'Observe the output.',
    ],
    program: `module multiplier_2bit (
    input  [1:0] A,      // 2-bit input multiplicand
    input  [1:0] B,      // 2-bit input multiplier
    output [3:0] Product // 4-bit output result (Max value: 3 * 3 = 9)
);

    // Behavioral description using dataflow assignment
    assign Product = A * B;

endmodule`,
    programTitle: 'Verilog Code for 2-bit Multiplier',
    conclusion: 'The Verilog program for 2-bit Multiplier was written and simulated.',
    truthTable: {
      inputHeaders: ['A [1:0]', 'B [1:0]'],
      outputHeaders: ['Product [3:0]', 'Decimal'],
      rows: [
        { inputs: { 'A [1:0]': '00 (0)', 'B [1:0]': '00 (0)' }, outputs: { 'Product [3:0]': '0000', Decimal: '0' } },
        { inputs: { 'A [1:0]': '01 (1)', 'B [1:0]': '01 (1)' }, outputs: { 'Product [3:0]': '0001', Decimal: '1' } },
        { inputs: { 'A [1:0]': '01 (1)', 'B [1:0]': '10 (2)' }, outputs: { 'Product [3:0]': '0010', Decimal: '2' } },
        { inputs: { 'A [1:0]': '10 (2)', 'B [1:0]': '10 (2)' }, outputs: { 'Product [3:0]': '0100', Decimal: '4' } },
        { inputs: { 'A [1:0]': '10 (2)', 'B [1:0]': '11 (3)' }, outputs: { 'Product [3:0]': '0110', Decimal: '6' } },
        { inputs: { 'A [1:0]': '11 (3)', 'B [1:0]': '11 (3)' }, outputs: { 'Product [3:0]': '1001', Decimal: '9' } },
      ],
      sourceNote: 'Selected rows. Maximum product is 3×3=9 (1001 binary). 4-bit output accommodates all values.',
    },
    vivaQuestions: [
      {
        question: 'How is a 2-bit multiplier implemented at gate level?',
        answer: 'At gate level: 4 AND gates generate the 4 partial products (A0B0, A1B0, A0B1, A1B1). Two half-adders sum the partial products. Final carry and bit arrangement gives the 4-bit product. This is the combinational array multiplier approach.',
      },
      {
        question: 'Why is the product output 4 bits wide for a 2×2 bit multiplier?',
        answer: 'The maximum product of two N-bit numbers requires up to 2N bits. For 2-bit numbers: max = 3 × 3 = 9, which requires 4 bits (since 2^4 = 16 > 9). The general rule: N-bit × N-bit → 2N-bit product.',
      },
      {
        question: 'What is the "assign Product = A * B" in Verilog doing?',
        answer: 'This is a dataflow assignment. Verilog\'s * operator performs unsigned multiplication. The synthesis tool maps this to a combinational multiplier circuit (usually an array multiplier or Wallace tree multiplier). For simulation, it directly computes the arithmetic product.',
      },
    ],
    manualPages: [27, 28],
  },
];

export const experimentsBySection = {
  A: experiments.filter(e => e.section === 'A'),
  B: experiments.filter(e => e.section === 'B'),
  C: experiments.filter(e => e.section === 'C'),
};

export function getExperimentById(id: string): Experiment | undefined {
  return experiments.find(e => e.id === id);
}

export function getExperimentByNumber(num: number): Experiment | undefined {
  return experiments.find(e => e.number === num);
}
