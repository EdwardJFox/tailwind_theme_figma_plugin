// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

import { ExportValue, exportToCss, exportToJs } from "./export";
import {
  AvailableFontTypes,
  figmaRgbToCssRgba,
  parseFigmaNameToCssName,
  parseFontStyleToNumber,
  convertPixelsToRem,
  buildBoxShadow
} from "./parsing";

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 450, height: 555 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage =  async (msg: {type: string, tailwindVersion: string, baseFontSize: number, handleNested: boolean}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'export') {
    const exportRows: ExportValue[] = [];
    const colorStyles = await figma.getLocalPaintStylesAsync();

    for (const colorStyle of colorStyles) {
      // They only come in PAINT styles, but just in case lets not break it in future
      if (colorStyle.type === 'PAINT') {
        if (colorStyle.paints[0].type === "SOLID") {
          exportRows.push({
            name: parseFigmaNameToCssName(colorStyle.name, 'color'),
            value: figmaRgbToCssRgba(colorStyle.paints[0].color, colorStyle.paints[0].opacity),
            type: 'color'
          });
        // } else if (colorStyle.paints[0].type === 'GRADIENT_LINEAR') {
        //   exportRows.push({
        //     name: parseFigmaNameToCssName(colorStyle.name),
        //     value: figmaGradientStopsToCss(colorStyle.paints[0].gradientStops)
        //   });
        }
      }
    }

    const textStyles = await figma.getLocalTextStylesAsync();
    const fontFamilies: string[] = [];
    for (const textStyle of textStyles) {
      // Add new font families to the array
      if (!fontFamilies.includes(textStyle.fontName.family)) {
        fontFamilies.push(textStyle.fontName.family);
      }

      exportRows.push({
        name: parseFigmaNameToCssName(textStyle.name),
        type: 'font-size',
        value: convertPixelsToRem(textStyle.fontSize, msg.baseFontSize)
      });

      exportRows.push({
        name: parseFigmaNameToCssName(textStyle.name),
        type: 'font-weight',
        value: parseFontStyleToNumber(textStyle.fontName.style as AvailableFontTypes)
      });

      // To type .value
      if (textStyle.lineHeight.unit === 'PIXELS') {
        exportRows.push({
          name: parseFigmaNameToCssName(textStyle.name),
          type: 'line-height',
          value: convertPixelsToRem(textStyle.lineHeight.value, msg.baseFontSize)
        });
      }
    }

    fontFamilies.forEach((fontFamily) => {
      exportRows.push({
        name: fontFamily.toLowerCase().replace(/ /gi, '-'),
        type: 'font-family',
        value: fontFamily
      });
    });

    const effectStyles = await figma.getLocalEffectStylesAsync();

    for (const effectStyle of effectStyles) {
      for (const effect of effectStyle.effects) {
        if (effect.type === 'DROP_SHADOW') {
          exportRows.push({
            name: parseFigmaNameToCssName(effectStyle.name, 'shadow'),
            type: 'shadow',
            value: buildBoxShadow(effect, msg.baseFontSize),
          })
        }
      }
    }

    if (msg.tailwindVersion === '4') {
      figma.ui.postMessage({
        type: 'output',
        output: exportToCss(exportRows),
        format: 'css'
      });
    } else {
      figma.ui.postMessage({
        type: 'output',
        output: JSON.stringify(exportToJs(exportRows, msg.handleNested), null, 2),
        format: 'js'
      });
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};