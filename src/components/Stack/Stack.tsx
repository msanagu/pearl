import { FlexBox, type FlexBoxProps } from '../layout/FlexBox';

export interface StackProps extends Omit<FlexBoxProps, 'direction'> {}

/**
 * Vertical layout. A thin preset over the shared flex primitive with
 * `direction: column`. Use for page/section/form layout — `gap` is typed to the
 * space scale, so spacing stays on-system by construction.
 *
 * @example
 * <Stack gap="lg">
 *   <Text variant="headingLg" as="h1">Settings</Text>
 *   <Card>…</Card>
 * </Stack>
 */
export function Stack(props: StackProps) {
  return <FlexBox direction="column" {...props} />;
}
