import { useState } from 'react';
import { PiArrowRight, PiCaretDown } from 'react-icons/pi';
import { Alert } from '@components/Alert/Alert';
import { Button } from '@components/Button/Button';
import { Card } from '@components/Card/Card';
import { Icon } from '@components/Icon/Icon';
import { Link } from '@components/Link/Link';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Tag } from '@components/Tag/Tag';
import { Text } from '@components/Text/Text';
import * as css from './Dashboard.css';

const kpis = [
  { label: 'Monthly recurring revenue', value: '$482,910', delta: '▲ 6.2%', tone: 'positive' as const },
  { label: 'Active workspaces', value: '3,148', delta: '▲ 114', tone: 'positive' as const },
  { label: 'Net revenue retention', value: '112%', delta: '▲ 3 pts', tone: 'positive' as const },
  { label: 'Trial → paid conversion', value: '24.8%', delta: '▼ 1.9 pts', tone: 'negative' as const },
  { label: 'Churned seats', value: '317', delta: '▲ 42', tone: 'negative' as const },
  { label: 'P95 API latency', value: '412 ms', delta: '▲ 88 ms', tone: 'warn' as const },
  { label: 'Support backlog', value: '61', delta: '▼ 12', tone: 'positive' as const },
  { label: 'Expansion ARR', value: '$96,400', delta: '▲ 11.4%', tone: 'positive' as const },
];

const signups = [38, 44, 41, 52, 49, 63, 58, 71, 66, 80, 74, 92];
const peak = Math.max(...signups);

const plans = [
  { name: 'Scale', seats: '1,402 seats', share: '46%', tag: 'Growing', variant: 'positive' as const },
  { name: 'Team', seats: '1,010 seats', share: '32%', tag: 'Flat', variant: 'neutral' as const },
  { name: 'Starter', seats: '512 seats', share: '16%', tag: 'Declining', variant: 'negative' as const },
  { name: 'Enterprise', seats: '224 seats', share: '6%', tag: 'Pipeline', variant: 'info' as const },
];

/**
 * A SaaS metrics dashboard composed entirely from existing primitives —
 * `Card`, `Alert`, `Tag`, `Button`, `Row`/`Stack`, `Text`. The responsive
 * KPI grid and two-column panel layout are plain CSS (no Grid primitive
 * exists yet); the signups chart is bars sized by inline `style` (geometry
 * is data, never a token) using the sentiment `surface`/`border` sub-fields
 * as a stand-in for a saturated data-viz fill this system doesn't have yet.
 */
export function Dashboard() {
  const [notice, setNotice] = useState(true);

  return (
    <div className={css.dash}>
      <Stack gap="lg">
        <div className={css.head}>
          <Stack gap="xs">
            <Text role="preheading" prominence="subtle" as="p">
              miSaaS · Growth
            </Text>
            <Text typeScale="headingMd" as="h1">
              Company metrics
            </Text>
            <Text typeScale="bodySm" prominence="subtle" as="p">
              Rolling 30 days · updated 14 minutes ago
            </Text>
          </Stack>

          <div className={css.headActions}>
            <Button variant="secondary">
              Last 30 days
              <Icon icon={PiCaretDown} size={16} />
            </Button>
            <Button variant="primary">
              Export report
              <Icon icon={PiArrowRight} size={16} />
            </Button>
          </div>
        </div>

        {notice ? (
          <Alert
            variant="info"
            heading="Billing sync is catching up"
            onDismiss={() => setNotice(false)}
          >
            Revenue figures exclude the last hour of invoices.
          </Alert>
        ) : null}

        <div className={css.kpiGrid}>
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <Stack gap="sm">
                <Text typeScale="bodySm" prominence="subtle" as="p">
                  {kpi.label}
                </Text>
                <Text role="dataDigits" typeScale="headingMd" as="p">
                  {kpi.value}
                </Text>
                <Row gap="xs" wrap align="baseline">
                  <Tag variant={kpi.tone}>{kpi.delta}</Tag>
                  <Text typeScale="bodySm" prominence="subtle" as="span">
                    vs. prior period
                  </Text>
                </Row>
              </Stack>
            </Card>
          ))}
        </div>

        <div className={css.panels}>
          <Card>
            <Card.Header>
              <Stack gap="xs">
                <Text typeScale="headingSm" as="h2">
                  Weekly signups
                </Text>
                <Text typeScale="bodyMd" prominence="subtle" as="p">
                  Twelve weeks · peak of {peak} in the current week
                </Text>
              </Stack>
            </Card.Header>
            <Card.Body className={css.chartCardBody}>
              <Stack gap="sm">
                <div className={css.chart} role="img" aria-label={`Weekly signups, twelve weeks, from 38 to ${peak}`}>
                  {signups.map((v, i) => (
                    <div className={css.chartCol} key={i}>
                      <div
                        className={css.bar}
                        data-peak={v === peak ? 'true' : 'false'}
                        style={{ height: `${Math.round((v / peak) * 100)}%` }}
                      />
                    </div>
                  ))}
                </div>
                <Text typeScale="bodyMd" prominence="subtle" as="p">
                  Signups are up{' '}
                  <Text as="span" role="inlineEmphasis">
                    142%
                  </Text>{' '}
                  since the self-serve onboarding change in week 4.
                </Text>
              </Stack>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Text typeScale="headingSm" as="h2">
                Seats by plan
              </Text>
            </Card.Header>
            <Card.Body>
              <Stack gap="md">
                {plans.map((plan) => (
                  <div className={css.planRow} key={plan.name}>
                    <Stack gap="xs">
                      <Text typeScale="bodyMd" weight="semibold" as="p">
                        {plan.name}
                      </Text>
                      <Text typeScale="bodyMd" prominence="subtle" as="p">
                        {plan.seats} · {plan.share} of base
                      </Text>
                    </Stack>
                    <Tag variant={plan.variant}>{plan.tag}</Tag>
                  </div>
                ))}
                <Text typeScale="bodySm" as="p" measure="sm">
                  Starter seats continue migrating upward.{' '}
                  <Link href="#">See the plan migration breakdown</Link>.
                </Text>
              </Stack>
            </Card.Body>
          </Card>
        </div>
      </Stack>
    </div>
  );
}
