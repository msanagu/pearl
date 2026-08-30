import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { IconType } from 'react-icons';
// Fill-weight Phosphor: the mark is a solid shape carrying the sentiment color,
// so it reads at small sizes against a tinted surface.
import {
  PiCheckCircleFill,
  PiInfoFill,
  PiWarningCircleFill,
  PiXCircleFill,
} from 'react-icons/pi';
import { Icon } from '@components/Icon/Icon';
import { Text } from '@components/Text/Text';
import { XButton } from '@components/_internal/XButton/XButton';
import { color } from '@tokens';
import { alert, iconSlot, content } from './Alert.css';

type AlertVariants = NonNullable<RecipeVariants<typeof alert>>;
export type AlertVariant = NonNullable<AlertVariants['variant']>;

// Named by valence (`positive`/`negative`/`warn`/`info`), matching the
// sentiment tokens in theme.css.ts — not by prominence ("success"/"error"),
// and not split across a separate "Notification" component: severity lives
// entirely in `variant`, so an `info` or `positive` Alert is exactly as
// first-class as a `negative` one.
const defaultIconByVariant: Record<AlertVariant, IconType> = {
  positive: PiCheckCircleFill,
  negative: PiXCircleFill,
  warn: PiWarningCircleFill,
  info: PiInfoFill,
};

const iconColorByVariant: Record<AlertVariant, string> = {
  positive: color.positive.icon,
  negative: color.negative.icon,
  warn: color.warn.icon,
  info: color.info.icon,
};

const textColorByVariant: Record<AlertVariant, string> = {
  positive: color.positive.text,
  negative: color.negative.text,
  warn: color.warn.text,
  info: color.info.text,
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** @default 'info' */
  variant?: AlertVariant;
  /** Optional lead-in above the body content. */
  heading?: ReactNode;
  /** Overrides the variant's default icon. */
  icon?: IconType;
  /** Presence of this prop is what renders the dismiss button — no separate boolean. */
  onDismiss?: () => void;
  children?: ReactNode;
}

/**
 * Inline, persistent feedback — form errors, page-level status, confirmations.
 * For low-priority messages that are fine to miss, use `Toast` (a delivery
 * mechanism that renders this same component in a portal with auto-dismiss),
 * not a different visual component.
 */
// `negative`/`warn` are urgent enough to interrupt assistive tech on mount —
// `role="alert"` is an assertive live region. `positive`/`info` are static
// confirmations, not urgent, so they carry no role at all. `role="status"`
// (polite live region) is deliberately not used here: it exists for content
// that changes in place after mount — which is exactly what `Toast` (see
// this component's own doc comment) will need once it renders Alert inside
// a portal with auto-dismiss. A statically-rendered Alert never mutates, so
// there's nothing for a live region to announce a change to.
const roleByVariant: Partial<Record<AlertVariant, 'alert'>> = {
  negative: 'alert',
  warn: 'alert',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      heading,
      icon,
      onDismiss,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const IconComponent = icon ?? defaultIconByVariant[variant];
    const textColor = textColorByVariant[variant];

    return (
      <div
        ref={ref}
        role={roleByVariant[variant]}
        data-component="alert"
        className={clsx(alert({ variant }), className)}
        {...rest}
      >
        <Icon
          icon={IconComponent}
          className={iconSlot}
          style={{ color: iconColorByVariant[variant] }}
        />

        <div data-part="content" className={content}>
          {heading && (
            <Text
              as="p"
              data-part="heading"
              typeScale="bodyMd"
              weight="semibold"
              style={{ color: textColor }}
            >
              {heading}
            </Text>
          )}
          {children && (
            <Text as="p" typeScale="bodySm" style={{ color: textColor }}>
              {children}
            </Text>
          )}
        </div>

        {onDismiss && (
          <XButton aria-label="Dismiss notification" onClick={onDismiss} />
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
