import { EquationItem, Operator } from '../types';

export const evaluateEquation = (items: EquationItem[]): number | null => {
  if (items.length === 0) return null;

  // Create a string representation for evaluation
  // Warning: We are carefully constructing this from strictly typed inputs to avoid injection
  let equationString = '';
  
  for (const item of items) {
    if (item.type === 'operator') {
      const op = item.value as Operator;
      if (op === '×') equationString += '*';
      else if (op === '÷') equationString += '/';
      else equationString += op;
    } else {
      equationString += item.value;
    }
  }

  try {
    // Check for trailing operators
    const lastItem = items[items.length - 1];
    if (lastItem.type === 'operator') {
      return null; // Incomplete equation
    }

    // Check for division by zero
    if (equationString.includes('/0')) {
      return Infinity; 
    }

    // Safe evaluation
    // eslint-disable-next-line
    const result = new Function('return ' + equationString)();
    
    // Check if result is a finite number
    if (!Number.isFinite(result) || Number.isNaN(result)) {
      return null;
    }

    // Round to 2 decimals if needed (though game logic tries to stay integer)
    return Math.round(result * 100) / 100;
  } catch (e) {
    return null;
  }
};

export const generateTargetNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
