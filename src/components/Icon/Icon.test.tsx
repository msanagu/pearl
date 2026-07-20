import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Heart } from '@phosphor-icons/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders the given Phosphor icon with defaults', () => {
    const { container } = render(<Icon icon={Heart} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-component', 'icon');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('forwards a custom size', () => {
    const { container } = render(<Icon icon={Heart} size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('merges a custom className', () => {
    const { container } = render(<Icon icon={Heart} className="custom" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('custom');
  });

  it('forwards ref to the underlying svg element', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Icon icon={Heart} ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('applies the duotone weight', () => {
    const { container } = render(<Icon icon={Heart} weight="duotone" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
