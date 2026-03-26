// ─── Deal Pipeline Data ──────────────────────────────────────────────────────

export const FEE_RATE = 0.01

export const DEAL_STAGES = [
  { key: 'lead', label: 'Lead', color: 'slate' },
  { key: 'contacted', label: 'Contacted', color: 'blue' },
  { key: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'purple' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'amber' },
  { key: 'negotiation', label: 'Negotiation', color: 'primary' },
  { key: 'won', label: 'Won', color: 'emerald' },
  { key: 'lost', label: 'Lost', color: 'red' },
]

export const STAGE_STYLES = {
  lead: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  contacted: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  meeting_scheduled: 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
  proposal_sent: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  negotiation: 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400',
  won: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  lost: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400',
}

export const STAGE_DOT_COLORS = {
  lead: 'bg-slate-400',
  contacted: 'bg-blue-500',
  meeting_scheduled: 'bg-purple-500',
  proposal_sent: 'bg-amber-500',
  negotiation: 'bg-primary-500',
  won: 'bg-emerald-500',
  lost: 'bg-red-500',
}

export const PRIORITY_STYLES = {
  Hot: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  Warm: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Cold: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
}

export const DUMMY_DEALS = [
  {
    id: 1,
    participantId: 0,
    participantName: 'Robert J. Martinez',
    participantEmail: 'robert.martinez@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'lead',
    dealValue: 487250,
    estimatedRevenue: 4872.50,
    source: 'Campaign: High Balance Q1 Check-In',
    priority: 'Hot',
    notes: 'High earner with significant plan balance. Clicked on retirement planning email twice.',
    nextAction: 'Send introductory email',
    nextActionDate: '2026-03-28',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-25T14:30:00Z',
    closedAt: null,
  },
  {
    id: 2,
    participantId: 5,
    participantName: 'Sarah L. Thompson',
    participantEmail: 'sarah.thompson@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'lead',
    dealValue: 215400,
    estimatedRevenue: 2154.00,
    source: 'Campaign: Q1 Benefits Enrollment',
    priority: 'Warm',
    notes: 'Opened benefits enrollment email. Approaching retirement age.',
    nextAction: 'Follow up on enrollment email',
    nextActionDate: '2026-03-30',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-21T09:00:00Z',
    updatedAt: '2026-03-24T11:00:00Z',
    closedAt: null,
  },
  {
    id: 3,
    participantId: 12,
    participantName: 'Jennifer M. Davis',
    participantEmail: 'jennifer.davis@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'lead',
    dealValue: 142800,
    estimatedRevenue: 1428.00,
    source: 'Manual',
    priority: 'Cold',
    notes: 'Identified through plan data review. Mid-career, steady contributions.',
    nextAction: 'Research participant profile',
    nextActionDate: '2026-04-01',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-22T14:00:00Z',
    updatedAt: '2026-03-22T14:00:00Z',
    closedAt: null,
  },
  {
    id: 4,
    participantId: 22,
    participantName: 'Michael A. Wilson',
    participantEmail: 'michael.wilson@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'contacted',
    dealValue: 612000,
    estimatedRevenue: 6120.00,
    source: 'Campaign: High Balance Q1 Check-In',
    priority: 'Hot',
    notes: 'Replied to check-in email expressing interest in wealth planning. Very engaged.',
    nextAction: 'Schedule discovery call',
    nextActionDate: '2026-03-29',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-14T08:00:00Z',
    updatedAt: '2026-03-26T09:15:00Z',
    closedAt: null,
  },
  {
    id: 5,
    participantId: 35,
    participantName: 'Patricia R. Anderson',
    participantEmail: 'patricia.anderson@viserly.demo',
    accountName: 'PlanSync',
    stage: 'contacted',
    dealValue: 328500,
    estimatedRevenue: 3285.00,
    source: 'Campaign: CA Contribution Boost',
    priority: 'Warm',
    notes: 'California-based. Opened contribution boost email and clicked link to resources.',
    nextAction: 'Send follow-up with meeting options',
    nextActionDate: '2026-03-31',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-16T10:00:00Z',
    updatedAt: '2026-03-24T16:00:00Z',
    closedAt: null,
  },
  {
    id: 6,
    participantId: 48,
    participantName: 'David K. Brown',
    participantEmail: 'david.brown@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'meeting_scheduled',
    dealValue: 766794,
    estimatedRevenue: 7667.94,
    source: 'Campaign: High Balance Q1 Check-In',
    priority: 'Hot',
    notes: 'Discovery meeting confirmed for April 2. Very interested in rollover options.',
    nextAction: 'Prepare discovery meeting agenda',
    nextActionDate: '2026-04-02',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-10T07:00:00Z',
    updatedAt: '2026-03-25T10:00:00Z',
    closedAt: null,
  },
  {
    id: 7,
    participantId: 63,
    participantName: 'Linda S. Garcia',
    participantEmail: 'linda.garcia@viserly.demo',
    accountName: 'PlanSync',
    stage: 'meeting_scheduled',
    dealValue: 445200,
    estimatedRevenue: 4452.00,
    source: 'Manual',
    priority: 'Warm',
    notes: 'Referred by existing client. Meeting set for next week to discuss wealth transfer planning.',
    nextAction: 'Send pre-meeting questionnaire',
    nextActionDate: '2026-04-01',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-12T11:00:00Z',
    updatedAt: '2026-03-23T15:30:00Z',
    closedAt: null,
  },
  {
    id: 8,
    participantId: 78,
    participantName: 'James T. Miller',
    participantEmail: 'james.miller@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'proposal_sent',
    dealValue: 892100,
    estimatedRevenue: 8921.00,
    source: 'Campaign: Annual Review 2025',
    priority: 'Hot',
    notes: 'Proposal sent March 20. Comprehensive wealth management plan including rollover and estate planning.',
    nextAction: 'Follow up on proposal',
    nextActionDate: '2026-03-28',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-03-20T14:00:00Z',
    closedAt: null,
  },
  {
    id: 9,
    participantId: 91,
    participantName: 'Barbara E. Taylor',
    participantEmail: 'barbara.taylor@viserly.demo',
    accountName: 'PlanSync',
    stage: 'proposal_sent',
    dealValue: 534600,
    estimatedRevenue: 5346.00,
    source: 'Campaign: Q1 Contribution Boost',
    priority: 'Warm',
    notes: 'Sent proposal March 22. Focused on contribution optimization and catch-up strategies.',
    nextAction: 'Schedule proposal review call',
    nextActionDate: '2026-03-30',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-03-22T16:30:00Z',
    closedAt: null,
  },
  {
    id: 10,
    participantId: 105,
    participantName: 'William H. Jackson',
    participantEmail: 'william.jackson@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'negotiation',
    dealValue: 1125000,
    estimatedRevenue: 11250.00,
    source: 'Campaign: High Balance Q1 Check-In',
    priority: 'Hot',
    notes: 'Discussing fee structure and service levels. Very engaged, wants comprehensive wealth management.',
    nextAction: 'Send revised fee proposal',
    nextActionDate: '2026-03-27',
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-02-28T08:00:00Z',
    updatedAt: '2026-03-25T11:00:00Z',
    closedAt: null,
  },
  {
    id: 11,
    participantId: 120,
    participantName: 'Elizabeth A. White',
    participantEmail: 'elizabeth.white@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'won',
    dealValue: 678400,
    estimatedRevenue: 6784.00,
    source: 'Campaign: Annual Review 2025',
    priority: 'Hot',
    notes: 'Signed on March 15. Full wealth management engagement including rollover and financial planning.',
    nextAction: null,
    nextActionDate: null,
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
    closedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 12,
    participantId: 138,
    participantName: 'Charles D. Harris',
    participantEmail: 'charles.harris@viserly.demo',
    accountName: 'PlanSync',
    stage: 'won',
    dealValue: 412300,
    estimatedRevenue: 4123.00,
    source: 'Manual',
    priority: 'Warm',
    notes: 'Converted March 18. Primarily interested in retirement income planning.',
    nextAction: null,
    nextActionDate: null,
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-03-18T14:00:00Z',
    closedAt: '2026-03-18T14:00:00Z',
  },
  {
    id: 13,
    participantId: 155,
    participantName: 'Margaret F. Clark',
    participantEmail: 'margaret.clark@viserly.demo',
    accountName: 'Demo Company ABC',
    stage: 'lost',
    dealValue: 295000,
    estimatedRevenue: 2950.00,
    source: 'Campaign: Q1 Benefits Enrollment',
    priority: 'Cold',
    notes: 'Decided to stay with current advisor. May revisit in Q3.',
    nextAction: null,
    nextActionDate: null,
    assignedTo: 'Cameron Abernethy',
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-03-10T16:00:00Z',
    closedAt: '2026-03-10T16:00:00Z',
  },
]

/** Get a deal by ID */
export function getDealById(id) {
  return DUMMY_DEALS.find((d) => d.id === Number(id))
}

/** Group deals by stage */
export function getDealsByStage(deals = DUMMY_DEALS) {
  const grouped = {}
  DEAL_STAGES.forEach((s) => { grouped[s.key] = [] })
  deals.forEach((d) => {
    if (grouped[d.stage]) grouped[d.stage].push(d)
  })
  return grouped
}

/** Get pipeline stats */
export function getPipelineStats(deals = DUMMY_DEALS) {
  const active = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
  const won = deals.filter((d) => d.stage === 'won')
  const lost = deals.filter((d) => d.stage === 'lost')
  const closed = won.length + lost.length

  return {
    totalDeals: deals.length,
    activeDeals: active.length,
    totalValue: active.reduce((sum, d) => sum + d.dealValue, 0),
    totalRevenue: active.reduce((sum, d) => sum + d.estimatedRevenue, 0),
    wonDeals: won.length,
    wonValue: won.reduce((sum, d) => sum + d.dealValue, 0),
    wonRevenue: won.reduce((sum, d) => sum + d.estimatedRevenue, 0),
    lostDeals: lost.length,
    winRate: closed > 0 ? ((won.length / closed) * 100).toFixed(1) : '0.0',
    avgDealValue: active.length > 0 ? Math.round(active.reduce((sum, d) => sum + d.dealValue, 0) / active.length) : 0,
  }
}

/** Get deals for a specific participant */
export function getDealsForParticipant(participantId) {
  return DUMMY_DEALS.filter((d) => d.participantId === Number(participantId))
}

/** Get stage label from key */
export function getStageLabel(key) {
  const stage = DEAL_STAGES.find((s) => s.key === key)
  return stage ? stage.label : key
}
