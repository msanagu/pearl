import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { PiHeart, PiHeartDuotone } from 'react-icons/pi';
import { LuHeart } from 'react-icons/lu';
import { RiErrorWarningFill } from 'react-icons/ri';
import { THEME_ICON_SETS } from './iconSets';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders the given icon with defaults', () => {
    const { container } = render(<Icon icon={PiHeart} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-component', 'icon');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('forwards a custom size', () => {
    const { container } = render(<Icon icon={PiHeart} size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('merges a custom className', () => {
    const { container } = render(<Icon icon={PiHeart} className="custom" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain(
      'custom',
    );
  });

  it('forwards ref to the underlying svg element', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Icon icon={PiHeart} ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  // The whole point of moving off the single-vendor package: any react-icons
  // set goes through unchanged, contract and all.
  it('accepts an icon from a different set', () => {
    const { container } = render(<Icon icon={LuHeart} />);
    expect(container.querySelector('svg')).toHaveAttribute(
      'data-component',
      'icon',
    );
  });

  // Duotone is weight-as-a-name now, and Icon.css.ts recolors the two layers
  // by source order — so the two-path structure is load-bearing, not cosmetic.
  it('renders duotone icons as two stacked paths', () => {
    const { container } = render(<Icon icon={PiHeartDuotone} />);
    expect(
      container.querySelectorAll('svg path').length,
    ).toBeGreaterThanOrEqual(2);
  });

  it('keeps Tahitian in the same warning-symbol family as the other themes', () => {
    expect(THEME_ICON_SETS.tahitian.warn).toBe(RiErrorWarningFill);
  });
});
