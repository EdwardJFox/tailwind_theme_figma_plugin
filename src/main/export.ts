import merge from "deepmerge";

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

const jsTypes: { [key: string]: string } = {
  shadow: 'boxShadow',
  color: 'colors'
}

export function exportToCss(values: ExportValue[]): string {
  return `@theme {
  ${values.map(({ name, value, type }) => `--${type}-${name}: ${type === 'font-family' ? `"${value}"` : value}`).join(';\n\t')};
}`
}

function createNestedObjectFromString(str: string, value: string | number): Record<string, string | number> {
  const parts = str.split('-');
  let current: Record<string, unknown> = {};
  const root = current;

  for (let i = 0; i < parts.length; i++) {
    current[parts[i]] = i === parts.length - 1 ? value : {};
    current = current[parts[i]] as Record<string, unknown>;
  }

  return root as Record<string, string | number>;
}

export function exportToJs(values: ExportValue[], handleNested = false): Record<string, Record<string, string | number>> {
  const toReturn = values.reduce((types, value) => {
    let type = value.type.replace(/-./g, match => match[1].toUpperCase());
    if (jsTypes[type]) type = jsTypes[type];
    if (!types[type]) types[type] = {};

    if (type === 'colors' && handleNested) {
      types[type] = merge(types[type], createNestedObjectFromString(value.name, value.value));
    } else {
      types[type][value.name] = value.value;
    }

    return types;
  }, {} as Record<string, Record<string, string | number>>);

  return toReturn;
}