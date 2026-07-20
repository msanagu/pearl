import { describe, it, expect } from 'vitest';
import { vars } from '../../src/theme.css';
import * as tahitian from '../../src/themes/tahitian.css';
import * as pearl from '../../src/themes/pearl.css';
import * as freshwater from '../../src/themes/freshwater.css';
import * as southSea from '../../src/themes/south-sea.css';

function keys(obj: any): any {
  if (obj === null || typeof obj !== 'object') return true;
  if (Array.isArray(obj)) return obj.map(keys);
  const out: any = {};
  for (const k of Object.keys(obj)) out[k] = keys(obj[k]);
  return out;
}

function diff(a: any, b: any, path = ''): string[] {
  const messages: string[] = [];
  if (a === true && b === true) return messages;
  if (a === true && b !== true) return [`Missing at ${path || 'root'}`];
  if (typeof a !== 'object' || a === null) return messages;
  for (const key of Object.keys(a)) {
    const pa = a[key];
    const pb = b?.[key];
    const p = path ? `${path}.${key}` : key;
    if (pb === undefined) messages.push(`Missing key: ${p}`);
    else messages.push(...diff(pa, pb, p));
  }
  return messages;
}

describe('theme contract shape', () => {
  it('tahitian matches vars shape', () => {
    const theme = (tahitian as any).tahitianLightThemeClass || (tahitian as any).tahitianLightThemeClass;
    const reported = keys(vars as any);
    const themeObj = keys((tahitian as any).tahitianLightThemeClass ? (tahitian as any).tahitianLightThemeClass : (tahitian as any));
    const errors = diff(reported, themeObj);
    if (errors.length) console.log('tahitian errors:', errors.slice(0, 20));
    expect(errors.length).toBe(0);
  });

  it('pearl matches vars shape', () => {
    const reported = keys(vars as any);
    const themeObj = keys((pearl as any).pearlLightThemeClass ? (pearl as any).pearlLightThemeClass : (pearl as any));
    const errors = diff(reported, themeObj);
    if (errors.length) console.log('pearl errors:', errors.slice(0, 20));
    expect(errors.length).toBe(0);
  });

  it('freshwater matches vars shape', () => {
    const reported = keys(vars as any);
    const themeObj = keys((freshwater as any).freshwaterLightThemeClass ? (freshwater as any).freshwaterLightThemeClass : (freshwater as any));
    const errors = diff(reported, themeObj);
    if (errors.length) console.log('freshwater errors:', errors.slice(0, 20));
    expect(errors.length).toBe(0);
  });

  it('south-sea matches vars shape', () => {
    const reported = keys(vars as any);
    const themeObj = keys((southSea as any).southSeaLightThemeClass ? (southSea as any).southSeaLightThemeClass : (southSea as any));
    const errors = diff(reported, themeObj);
    if (errors.length) console.log('southSea errors:', errors.slice(0, 20));
    expect(errors.length).toBe(0);
  });
});
