const MAX_DECIMAL_PLACES = 4;
const KEYWORDS = ['background'];

/**
 * Parse the incoming Figma Figma name into a nice Tailwind name
 * Remove duplicate first index entries, makes the string kebab case and lower case
 * 
 * @param name Name as returned by Figma
 */
export function parseFigmaNameToCssName(name: string, type = ""): string {
  const toReturn: string[] = [];
  for(const part of name.split(/[/\\.]/g)) {
    // Split by space so we can compare the start of the string
    const currentLevel = part.split(' ');
    // Remove duplicate definitions
    if (
      toReturn.includes(currentLevel[0].toLowerCase()) ||
      type === currentLevel[0].toLowerCase() ||
      KEYWORDS.includes(currentLevel[0].toLowerCase())
    ) {
      currentLevel.shift();
    }
    toReturn.push(
      currentLevel.map((c) => c.replace(/[\W_]+/g,"")).join('-').toLowerCase()
    );
  }

  return toReturn.filter(str => str.length > 0).join('-');
}

function decimalToRgbNumber(number: number): number {
  return Math.round(number * 255)  
}

const fontSizes = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900
};

export type AvailableFontTypes = keyof typeof fontSizes;

export function parseFontStyleToNumber(style: AvailableFontTypes): number {
  return fontSizes[style] || 100;
}

export function convertPixelsToRem(size: number, base: number): string {
  return `${Number((size / base).toFixed(MAX_DECIMAL_PLACES))}rem`;
}

/**
 * Change the RGB colour to a css compatible RGBA colour, embedding the opacity 
 * 
 * @param rgb RGB Figma object
 * @param opacity Opacity, from 0 to 1
 * @returns 
 */
export function figmaRgbToCssRgba(rgb: RGB, opacity = 1): string {
  return `rgba(${decimalToRgbNumber(rgb.r)}, ${decimalToRgbNumber(rgb.g)}, ${decimalToRgbNumber(rgb.b)}, ${Number(opacity.toFixed(MAX_DECIMAL_PLACES))})`;
}


const toHex = (value: number) => {
  const hex = Math.round(value * 255).toString(16).padStart(2, '0');
  return hex;
};

/**
 * Change the RGB colour to a hex colour, embedding the opacity 
 * 
 * @param rgb RGB Figma object
 * @param opacity Opacity, from 0 to 1
 * @returns 
 */
export function figmaRgbToHex(rgb: RGB, opacity = 1) {
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}${toHex(opacity)}`;
}

export function buildBoxShadow(effect: DropShadowEffect, base: number): string {
  return `${convertPixelsToRem(effect.offset.x, base)} ${convertPixelsToRem(effect.offset.y, base)} ${convertPixelsToRem(effect.radius, base)} ${convertPixelsToRem(effect.spread || 0, base)} ${figmaRgbToCssRgba(effect.color, effect.color.a)}`
}

// export function figmaGradientStopsToCss(stops: readonly ColorStop[]): string {
//   stops;
//   return '';
// }