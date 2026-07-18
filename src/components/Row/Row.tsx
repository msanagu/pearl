import { FlexBox, type FlexBoxProps } from '../layout/FlexBox';

export interface RowProps extends Omit<FlexBoxProps, 'direction'> {}

/**
 * Horizontal layout. A thin preset over the shared flex primitive with
 * `direction: row`. Use for button groups, inline field rows, toolbars.
 *
 * @example
 * <Row gap="sm" justify="end">
 *   <Button variant="secondary">Cancel</Button>
 *   <Button>Save</Button>
 * </Row>
 */
export function Row(props: RowProps) {
  return <FlexBox direction="row" {...props} />;
}
