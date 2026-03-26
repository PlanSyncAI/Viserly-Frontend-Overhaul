import { getCommsForCampaign, getCommStats } from './communicationData'

// Status definitions
export const CAMPAIGN_STATUSES = {
  ACTIVE: 'Active',
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
}

export const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Scheduled: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Completed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Draft: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
}

// Build stats from communication history where campaign names match
function buildStats(campaignName) {
  const records = getCommsForCampaign(campaignName)
  if (records.length === 0) {
    return { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' }
  }
  return getCommStats(records)
}

export const DUMMY_CAMPAIGNS = [
  {
    id: 1,
    name: 'Q1 Benefits Enrollment',
    description: 'Open enrollment reminder for Q1 benefits period targeting high-income participants.',
    status: 'Completed',
    segmentId: 1,
    segmentName: 'Test',
    templateId: 1,
    templateName: 'Q1 Benefits Enrollment Reminder',
    recipients: 425,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-20T09:00:00Z',
    scheduledAt: '2026-03-23T14:30:00Z',
    completedAt: '2026-03-23T14:31:00Z',
    stats: buildStats('Q1 Benefits Enrollment'),
  },
  {
    id: 2,
    name: 'High Balance Q1 Check-In',
    description: 'Quarterly check-in for participants with plan balances exceeding $500K.',
    status: 'Completed',
    segmentId: 2,
    segmentName: 'High Balance Participants',
    templateId: 10,
    templateName: 'High Balance Quarterly Check-In',
    recipients: 87,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-14T08:00:00Z',
    scheduledAt: '2026-03-18T10:00:00Z',
    completedAt: '2026-03-18T10:01:00Z',
    stats: buildStats('High Balance Q1 Check-In'),
  },
  {
    id: 3,
    name: 'New Hire Onboarding',
    description: 'Welcome sequence for employees hired in 2026 with plan introduction.',
    status: 'Active',
    segmentId: 3,
    segmentName: 'New Hires 2026',
    templateId: 8,
    templateName: 'New Hire Onboarding - Plan Intro',
    recipients: 34,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-10T07:00:00Z',
    scheduledAt: '2026-03-12T09:00:00Z',
    completedAt: null,
    stats: buildStats('New Hire Onboarding'),
  },
  {
    id: 4,
    name: 'CA Contribution Boost',
    description: '401(k) contribution increase nudge for California-based employees.',
    status: 'Active',
    segmentId: 4,
    segmentName: 'California Employees',
    templateId: 3,
    templateName: '401(k) Contribution Increase Nudge',
    recipients: 112,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-08T10:00:00Z',
    scheduledAt: '2026-03-10T11:00:00Z',
    completedAt: null,
    stats: buildStats('CA Contribution Boost'),
  },
  {
    id: 5,
    name: 'Q1 Contribution Boost',
    description: 'Broad contribution increase campaign for all eligible participants.',
    status: 'Active',
    segmentId: 1,
    segmentName: 'Test',
    templateId: 3,
    templateName: '401(k) Contribution Increase Nudge',
    recipients: 425,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-22T08:00:00Z',
    scheduledAt: '2026-03-24T10:00:00Z',
    completedAt: null,
    stats: buildStats('Q1 Contribution Boost'),
  },
  {
    id: 6,
    name: 'Annual Review 2025',
    description: 'Year-in-review performance summary sent to all contacts.',
    status: 'Completed',
    segmentId: null,
    segmentName: null,
    templateId: 5,
    templateName: 'Annual Plan Performance Summary',
    recipients: 751,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-01-10T08:00:00Z',
    scheduledAt: '2026-01-15T09:00:00Z',
    completedAt: '2026-01-15T09:01:00Z',
    stats: buildStats('Annual Review 2025'),
  },
  {
    id: 7,
    name: 'Q2 Benefits Enrollment Reminder',
    description: 'Upcoming Q2 enrollment reminder for high balance participants.',
    status: 'Scheduled',
    segmentId: 2,
    segmentName: 'High Balance Participants',
    templateId: 1,
    templateName: 'Q1 Benefits Enrollment Reminder',
    recipients: 87,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-24T08:00:00Z',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    stats: { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
  },
  {
    id: 8,
    name: 'Birthday Outreach - April',
    description: 'Personalized birthday emails for participants with April birthdays.',
    status: 'Scheduled',
    segmentId: 4,
    segmentName: 'California Employees',
    templateId: 4,
    templateName: 'Default Trigger Email - Birthday',
    recipients: 112,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-23T08:00:00Z',
    scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    stats: { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
  },
  {
    id: 9,
    name: 'Retirement Readiness Check',
    description: 'Draft campaign targeting participants within 5 years of retirement.',
    status: 'Draft',
    segmentId: null,
    segmentName: null,
    templateId: 5,
    templateName: 'Default Trigger Email - Five Years Out from Retirement',
    recipients: 0,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-24T14:00:00Z',
    scheduledAt: null,
    completedAt: null,
    stats: { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
  },
  {
    id: 10,
    name: 'Medicare Awareness',
    description: 'Draft awareness campaign about Medicare enrollment for participants approaching 65.',
    status: 'Draft',
    segmentId: null,
    segmentName: null,
    templateId: 6,
    templateName: 'Default Trigger Email - Medicare Message (64.5)',
    recipients: 0,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-25T09:00:00Z',
    scheduledAt: null,
    completedAt: null,
    stats: { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
  },
]

/** Get a campaign by ID */
export function getCampaignById(id) {
  return DUMMY_CAMPAIGNS.find((c) => c.id === Number(id))
}

/** Aggregate stats across all campaigns */
export function getAggregateStats() {
  const withStats = DUMMY_CAMPAIGNS.filter((c) => c.stats.sent > 0)
  const totalSent = withStats.reduce((sum, c) => sum + c.stats.sent, 0)
  const totalDelivered = withStats.reduce((sum, c) => sum + c.stats.delivered, 0)
  const totalOpened = withStats.reduce((sum, c) => sum + c.stats.opened, 0)
  const totalClicked = withStats.reduce((sum, c) => sum + c.stats.clicked, 0)
  const avgOpenRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '0.0'
  const avgClickRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : '0.0'
  return { totalSent, totalDelivered, totalOpened, totalClicked, avgOpenRate, avgClickRate }
}

/** Format time until a future date */
export function formatTimeUntil(isoDate) {
  const diff = new Date(isoDate) - new Date()
  if (diff < 0) return 'Past'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h`
  return 'Soon'
}
