export type Position = 'GK' | 'DR' | 'DC' | 'DL' | 'MR' | 'MC' | 'ML' | 'ST' | 'RW' | 'LW' | 'CDM' | 'CAM' | 'RWB' | 'LWB';

export const FORMATIONS: Record<string, Record<Position, [number, number]>> = {
  '4-4-2': { GK: [50, 90], DR: [85, 70], DC: [65, 70], DC: [35, 70], DL: [15, 70], MR: [85, 50], MC: [65, 50], MC: [35, 50], ML: [15, 50], ST: [60, 20], ST: [40, 20] },
  // ... this needs to be valid JSON-like object where keys are unique. 
  // I must use unique keys if the position is same (e.g. DC1, DC2, MC1, MC2)
};
