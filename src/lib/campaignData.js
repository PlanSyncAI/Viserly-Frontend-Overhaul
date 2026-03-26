import { getCommsForCampaign, getCommStats } from './communicationData'

// Status definitions
export const CAMPAIGN_STATUSES = {
  ACTIVE: 'Active',
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
  PAUSED: 'Paused',
}

export const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Scheduled: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Completed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Draft: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Paused: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
}

// Campaign type styles
export const TYPE_STYLES = {
  single: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  drip: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
}

// Drip campaign conditions
export const DRIP_CONDITIONS = [
  { type: 'none', label: 'Send to everyone', description: 'No filtering — all recipients receive this step' },
  { type: 'opened_previous', label: 'Opened previous', description: 'Only if the recipient opened the previous email' },
  { type: 'not_opened_previous', label: 'Did not open previous', description: 'Only if the recipient did NOT open the previous email' },
  { type: 'clicked_previous', label: 'Clicked previous', description: 'Only if the recipient clicked a link in the previous email' },
  { type: 'not_clicked_previous', label: 'Did not click previous', description: 'Only if the recipient did NOT click in the previous email' },
]

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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
  // ── Drip Campaigns ──────────────────────────────────────────────
  {
    id: 11,
    name: 'New Hire Welcome Sequence',
    description: '3-step onboarding drip for new employees — welcome, contribution nudge, and plan overview.',
    type: 'drip',
    status: 'Active',
    segmentId: 3,
    segmentName: 'New Hires 2026',
    templateId: null,
    templateName: null,
    recipients: 34,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-15T09:00:00Z',
    scheduledAt: '2026-03-16T09:00:00Z',
    completedAt: null,
    currentStep: 1,
    totalSteps: 3,
    steps: [
      {
        id: 'step-1',
        order: 0,
        templateId: 8,
        templateName: 'New Hire Onboarding - Plan Intro',
        delayAmount: 0,
        delayUnit: 'days',
        condition: null,
        stats: { total: 34, sent: 34, delivered: 33, opened: 28, clicked: 12, replied: 3, bounced: 1, unsubscribed: 0, openRate: '84.8', clickRate: '42.9', replyRate: '8.8', deliveryRate: '97.1' },
      },
      {
        id: 'step-2',
        order: 1,
        templateId: 3,
        templateName: '401(k) Contribution Increase Nudge',
        delayAmount: 3,
        delayUnit: 'days',
        condition: { type: 'opened_previous' },
        stats: { total: 28, sent: 28, delivered: 27, opened: 18, clicked: 8, replied: 2, bounced: 1, unsubscribed: 0, openRate: '66.7', clickRate: '44.4', replyRate: '7.1', deliveryRate: '96.4' },
      },
      {
        id: 'step-3',
        order: 2,
        templateId: 5,
        templateName: 'Annual Plan Performance Summary',
        delayAmount: 7,
        delayUnit: 'days',
        condition: null,
        stats: { total: 28, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
      },
    ],
    stats: { total: 62, sent: 62, delivered: 60, opened: 46, clicked: 20, replied: 5, bounced: 2, unsubscribed: 0, openRate: '76.7', clickRate: '43.5', replyRate: '8.1', deliveryRate: '96.8' },
  },
  {
    id: 12,
    name: 'Retirement Readiness Drip',
    description: '4-step sequence for participants within 5 years of retirement — planning, Medicare, Social Security, and final checklist.',
    type: 'drip',
    status: 'Scheduled',
    segmentId: 2,
    segmentName: 'High Balance Participants',
    templateId: null,
    templateName: null,
    recipients: 87,
    sentBy: 'Cameron Abernethy',
    createdAt: '2026-03-24T10:00:00Z',
    scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    currentStep: 0,
    totalSteps: 4,
    steps: [
      {
        id: 'step-1',
        order: 0,
        templateId: 5,
        templateName: 'Default Trigger Email - Five Years Out from Retirement',
        delayAmount: 0,
        delayUnit: 'days',
        condition: null,
        stats: { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
      },
      {
        id: 'step-2',
        order: 1,
        templateId: 6,
        templateName: 'Default Trigger Email - Medicare Message (64.5)',
        delayAmount: 5,
        delayUnit: 'days',
        condition: { type: 'opened_previous' },
        stats: { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
      },
      {
        id: 'step-3',
        order: 2,
        templateId: 9,
        templateName: 'Default Trigger Email - Retirement Age (65)',
        delayAmount: 7,
        delayUnit: 'days',
        condition: null,
        stats: { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
      },
      {
        id: 'step-4',
        order: 3,
        templateId: 7,
        templateName: 'Default Trigger Email - One Year Out from Retirement',
        delayAmount: 14,
        delayUnit: 'days',
        condition: { type: 'not_opened_previous' },
        stats: { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, openRate: '0.0', clickRate: '0.0', replyRate: '0.0', deliveryRate: '0.0' },
      },
    ],
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

/** Get drip campaign progress */
export function getDripProgress(campaign) {
  if (campaign.type !== 'drip' || !campaign.steps) return null
  const completedSteps = campaign.steps.filter((s) => s.stats.sent > 0).length
  return {
    completedSteps,
    totalSteps: campaign.totalSteps,
    percentage: campaign.totalSteps > 0 ? Math.round((completedSteps / campaign.totalSteps) * 100) : 0,
  }
}

/** Get condition label */
export function getConditionLabel(condition) {
  if (!condition) return 'All recipients'
  const found = DRIP_CONDITIONS.find((c) => c.type === condition.type)
  return found ? found.label : 'All recipients'
}
