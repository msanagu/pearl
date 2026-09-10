import { Card } from '@components/Card/Card';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';

export interface LinkCardProps {
  title: string;
  description: string;
  /** Omit to render a static (non-link) card. */
  href?: string;
}

/**
 * The "Next steps" / "Related to" card: a title + one-line description inside
 * a linking Card. Extracted from Setup's own next-steps cards so both surfaces
 * share one definition — see Setup.tsx and StoryDoc's "Related to" section.
 */
export function LinkCard({ title, description, href }: LinkCardProps) {
  return (
    <Card
      padding="md"
      style={{ flex: '1 1 200px', minWidth: 0 }}
      {...(href ? { href, target: '_top' as const } : {})}
    >
      <Stack gap="xs">
        <Text as="p" typeScale="bodyMd" weight="semibold">
          {title}
        </Text>
        <Text as="p" typeScale="bodySm" prominence="subtle">
          {description}
        </Text>
      </Stack>
    </Card>
  );
}
