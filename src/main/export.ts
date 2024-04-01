type ExportValueType = 
| 'color'
| 'font-family'
| 'font-size'
| 'font-weight'
| 'line-height'
| 'shadow';

export type ExportValue = {
  name: string;
  value: string | number;
  type: ExportValueType;
}

export function exportToCss(values: ExportValue[]): string {
  return `@theme {
  ${values.map(({ name, value, type }) => `--${type}-${name}: ${type === 'font-family' ? `"${value}"` : value}`).join(';\n\t')}
}`
}