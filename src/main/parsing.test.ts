import { describe, test, expect } from 'vitest'
import { parseFigmaNameToCssName, figmaRgbToCssRgba, figmaRgbToHex } from "./parsing";

describe('parseFigmaNameToCssName', () => {

  test('converts a capitalised single word into the lowercase version', () => {
    expect(parseFigmaNameToCssName('Color')).toBe('color');
  });

  test('keeps a lowercase single word as its lowercase version', () => {
    expect(parseFigmaNameToCssName('color')).toBe('color');
  });

  test('converts a name with spaces into kebab case', () => {
    expect(parseFigmaNameToCssName('top level color')).toBe('top-level-color');
  });

  test('converts a name with spaces and capitalisation into lower case and kebab case', () => {
    expect(parseFigmaNameToCssName('Top Level Color')).toBe('top-level-color');
  });

  describe('Using . as a separator', () => {
    test('converts dot name into lower case and kebab case', () => {
      expect(parseFigmaNameToCssName('primary.darker.hover')).toBe('primary-darker-hover');
    });
  
    test('converts dot name with duplicated first index for a part into lower case, kebab case', () => {
      expect(parseFigmaNameToCssName('primary.primary')).toBe('primary');
    });
  
    test('converts dot name with duplicated first index for a part and extra info into lower case, kebab case', () => {
      expect(parseFigmaNameToCssName('primary.primary.dark')).toBe('primary-dark');
    });
  
    test('converts deeply nested folder with duplicated first index for a part and extra info into lower case, kebab case', () => {
      expect(parseFigmaNameToCssName('primary.nested.primary.dark')).toBe('primary-nested-dark');
    });
  
    test('converts deeply nested folder with duplicated first index and extra info into lower case, kebab case', () => {
      expect(parseFigmaNameToCssName('primary.nested.primary primary')).toBe('primary-nested-primary');
    });
  
    test('removes non alphanumeric characters from the string', () => {
      expect(parseFigmaNameToCssName('primary.nested.accent (dark)')).toBe('primary-nested-accent-dark');
    });
  
    test('with a type, first words which are the same get removed as type will be appended on export', () => {
      expect(parseFigmaNameToCssName('shadow.nested.accent (dark)', 'shadow')).toBe('nested-accent-dark');
    });
  });

  describe('Using / as a separator', () => {
    test('converts folder into lower case and kebab case', () => {
      expect(parseFigmaNameToCssName('Primary/Darker')).toBe('primary-darker');
    });
  
    test('converts folder with duplicated first index for a part into lower case, kebab case', () => {
      expect(parseFigmaNameToCssName('Primary/Primary')).toBe('primary');
    });
  
    test('converts folder with duplicated first index for a part and extra info into lower case, kebab case', () => {
      expect(parseFigmaNameToCssName('Primary/Primary Dark')).toBe('primary-dark');
    });
  
    test('converts deeply nested folder with duplicated first index for a part and extra info into lower case, kebab case', () => {
      expect(parseFigmaNameToCssName('Primary/Nested/Primary Dark')).toBe('primary-nested-dark');
    });
  
    test('converts deeply nested folder with duplicated first index and extra info into lower case, kebab case', () => {
      expect(parseFigmaNameToCssName('Primary/Nested/Primary Primary')).toBe('primary-nested-primary');
    });
  
    test('removes non alphanumeric characters from the string', () => {
      expect(parseFigmaNameToCssName('Primary/Nested/Accent (Dark)')).toBe('primary-nested-accent-dark');
    });
  
    test('with a type, first words which are the same get removed as type will be appended on export', () => {
      expect(parseFigmaNameToCssName('Shadow/Nested/Accent (Dark)', 'shadow')).toBe('nested-accent-dark');
    });
  });

  describe('Removing keyword background', () => {
    test('with a type, first words which are the same get removed as type will be appended on export', () => {
      expect(parseFigmaNameToCssName('background.neutral.dark')).toBe('neutral-dark');
    });
  });
});

describe('figmaRgbToCssRgba', () => {
  test('handles black', () => {
    expect(figmaRgbToCssRgba({ r: 0, g: 0, b: 0 }, 1)).toBe('rgba(0, 0, 0, 1)');
  });

  test('handles white', () => {
    expect(figmaRgbToCssRgba({ r: 1, g: 1, b: 1 }, 1)).toBe('rgba(255, 255, 255, 1)');
  });

  test('handles middling values', () => {
    expect(figmaRgbToCssRgba({ r: 0.25, g: 0.5, b: 0.75 }, 1)).toBe('rgba(64, 128, 191, 1)');
  });

  test('passes opacity along', () => {
    expect(figmaRgbToCssRgba({ r: 1, g: 1, b: 1 }, 0.45)).toBe('rgba(255, 255, 255, 0.45)');
  });
});

describe('figmaRgbToHex', () => {
  test('handles black', () => {
    expect(figmaRgbToHex({ r: 0, g: 0, b: 0 }, 1)).toBe('#000000ff');
  });

  test('handles white', () => {
    expect(figmaRgbToHex({ r: 1, g: 1, b: 1 }, 1)).toBe('#ffffffff');
  });

  test('handles middling values', () => {
    expect(figmaRgbToHex({ r: 0.25, g: 0.5, b: 0.75 }, 0.45)).toBe('#4080bf73');
  });
});