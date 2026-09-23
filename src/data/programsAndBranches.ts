import { BranchCode, ProgramCode, DivisionLetter, BatchNumber } from '../types/timetable';

export interface ProgramInfo {
  code: ProgramCode;
  name: string;
  shortName: string;
  durationYears: number;
}

export interface BranchInfo {
  code: BranchCode;
  name: string;
  shortLabel: string;
  campus: 'Bibwewadi Campus' | 'Kondhwa Campus';
  defaultDivisions: DivisionLetter[];
}

export const PROGRAMS: ProgramInfo[] = [
  {
    code: 'BTECH',
    name: 'Bachelor of Technology (B.Tech)',
    shortName: 'B.Tech',
    durationYears: 4,
  },
  {
    code: 'MTECH',
    name: 'Master of Technology (M.Tech)',
    shortName: 'M.Tech',
    durationYears: 2,
  },
  {
    code: 'MCA',
    name: 'Master of Computer Applications (MCA)',
    shortName: 'MCA',
    durationYears: 2,
  },
];

export const BRANCHES: Record<BranchCode, BranchInfo> = {
  CS: {
    code: 'CS',
    name: 'Computer Engineering',
    shortLabel: 'Computer Engg',
    campus: 'Bibwewadi Campus',
    defaultDivisions: ['A', 'B', 'C', 'D'],
  },
  IT: {
    code: 'IT',
    name: 'Information Technology',
    shortLabel: 'Info Tech',
    campus: 'Bibwewadi Campus',
    defaultDivisions: ['A', 'B', 'C'],
  },
  CSAI: {
    code: 'CSAI',
    name: 'Computer Science & Engineering (Artificial Intelligence)',
    shortLabel: 'CSE (AI)',
    campus: 'Bibwewadi Campus',
    defaultDivisions: ['A', 'B', 'C'],
  },
  CSAIML: {
    code: 'CSAIML',
    name: 'Computer Science & Engineering (AI & Machine Learning)',
    shortLabel: 'CSE (AI-ML)',
    campus: 'Bibwewadi Campus',
    defaultDivisions: ['A', 'B', 'C', 'D'],
  },
  CSSE: {
    code: 'CSSE',
    name: 'Computer Science & Engineering (Software Engineering)',
    shortLabel: 'CSE (Software)',
    campus: 'Kondhwa Campus',
    defaultDivisions: ['A', 'B', 'C'],
  },
  CSDS: {
    code: 'CSDS',
    name: 'Computer Science & Engineering (Data Science)',
    shortLabel: 'CSE (Data Science)',
    campus: 'Kondhwa Campus',
    defaultDivisions: ['A', 'B'],
  },
  CSCBI: {
    code: 'CSCBI',
    name: 'Computer Science & Engineering (IoT & CSBT)',
    shortLabel: 'CSE (IoT & CSBT)',
    campus: 'Kondhwa Campus',
    defaultDivisions: ['A', 'B'],
  },
  AIDS: {
    code: 'AIDS',
    name: 'Artificial Intelligence & Data Science',
    shortLabel: 'AI & DS',
    campus: 'Kondhwa Campus',
    defaultDivisions: ['A', 'B', 'C'],
  },
  ET: {
    code: 'ET',
    name: 'Electronics & Telecommunication Engineering',
    shortLabel: 'EnTC',
    campus: 'Bibwewadi Campus',
    defaultDivisions: ['A', 'B', 'C'],
  },
  ME: {
    code: 'ME',
    name: 'Mechanical Engineering',
    shortLabel: 'Mechanical',
    campus: 'Bibwewadi Campus',
    defaultDivisions: ['A', 'B'],
  },
  IC: {
    code: 'IC',
    name: 'Instrumentation & Control Engineering',
    shortLabel: 'Instrumentation',
    campus: 'Bibwewadi Campus',
    defaultDivisions: ['A'],
  },
  CV: {
    code: 'CV',
    name: 'Civil Engineering',
    shortLabel: 'Civil Engg',
    campus: 'Bibwewadi Campus',
    defaultDivisions: ['A'],
  },
};

export const DIVISIONS: DivisionLetter[] = ['A', 'B', 'C', 'D', 'E', 'F'];
export const BATCHES: BatchNumber[] = ['1', '2', '3'];

export function getBranchInfo(code: BranchCode): BranchInfo {
  return (
    BRANCHES[code] || {
      code,
      name: code,
      shortLabel: code,
      campus: 'Bibwewadi Campus',
      defaultDivisions: ['A', 'B', 'C'],
    }
  );
}
