import type { IconType } from 'react-icons';
import {
  PiCheckCircleFill,
  PiXCircleFill,
  PiWarningCircleFill,
  PiInfoFill,
  PiXBold,
} from 'react-icons/pi';
import {
  RxCheckCircled,
  RxCrossCircled,
  RxExclamationTriangle,
  RxInfoCircled,
  RxCross2,
} from 'react-icons/rx';
import {
  TbCircleCheckFilled,
  TbCircleXFilled,
  TbAlertTriangleFilled,
  TbInfoCircleFilled,
  TbX,
} from 'react-icons/tb';
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
  RiCloseLine,
} from 'react-icons/ri';

/**
 * The small vocabulary of icons this system's own components (Alert, Field,
 * XButton) render without the consumer supplying one. Each theme picks its own
 * `react-icons` set for this vocabulary (see `iconLibraries.ts` for the
 * evaluation notes behind each pick) — everything else stays a per-usage
 * `icon` prop, unaffected by theme.
 */
export interface ThemeIconSet {
  positive: IconType;
  negative: IconType;
  warn: IconType;
  info: IconType;
  close: IconType;
}

export type ThemeName = 'pearl' | 'tahitian' | 'freshwater' | 'southSea';

// Pearl — Phosphor fill weight (see iconLibraries.ts: widest range, the
// system default).
const pearlIconSet: ThemeIconSet = {
  positive: PiCheckCircleFill,
  negative: PiXCircleFill,
  warn: PiWarningCircleFill,
  info: PiInfoFill,
  close: PiXBold,
};

// South Sea — Radix, drawn on a 15px grid, deliberately quiet to match the
// theme's "type/space/restraint, no ambient effect" identity.
const southSeaIconSet: ThemeIconSet = {
  positive: RxCheckCircled,
  negative: RxCrossCircled,
  warn: RxExclamationTriangle,
  info: RxInfoCircled,
  close: RxCross2,
};

// Freshwater — Tabler, even-stroke and instrument-panel neutral, matching the
// stark black/white ops-console register.
const freshwaterIconSet: ThemeIconSet = {
  positive: TbCircleCheckFilled,
  negative: TbCircleXFilled,
  warn: TbAlertTriangleFilled,
  info: TbInfoCircleFilled,
  close: TbX,
};

// Tahitian — Remix, matched outline/filled pairs with enough weight to hold
// against Anton's condensed heaviness.
const tahitianIconSet: ThemeIconSet = {
  positive: RiCheckboxCircleFill,
  negative: RiCloseCircleFill,
  warn: RiErrorWarningFill,
  info: RiInformationFill,
  close: RiCloseLine,
};

export const THEME_ICON_SETS: Readonly<Record<ThemeName, ThemeIconSet>> = {
  pearl: pearlIconSet,
  southSea: southSeaIconSet,
  freshwater: freshwaterIconSet,
  tahitian: tahitianIconSet,
};

export const DEFAULT_THEME_ICON_SET = pearlIconSet;
