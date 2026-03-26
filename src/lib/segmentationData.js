// Dummy segmentation data and filter field definitions

export const FILTER_FIELDS = [
  { key: 'salary', label: 'Annual Income', type: 'number' },
  { key: 'mailingCity', label: 'City (Primary Address)', type: 'text' },
  { key: 'account', label: 'Company Name', type: 'text' },
  { key: 'contactTags', label: 'Contact Tags', type: 'text' },
  { key: 'age', label: "Customer's Age", type: 'number' },
  { key: 'daysSinceEntry', label: 'Days Since Entry Date', type: 'number' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'emailOptOut', label: 'Email Opt Out', type: 'boolean' },
  { key: 'employmentActive', label: 'Employment Status', type: 'boolean' },
  { key: 'firstName', label: 'First Name', type: 'text' },
  { key: 'lastName', label: 'Last Name', type: 'text' },
  { key: 'maritalStatus', label: 'Marital Status', type: 'text' },
  { key: 'planBalance', label: 'Plan Balance', type: 'number' },
  { key: 'preTaxContribRate', label: 'Pre-Tax Contribution Rate', type: 'number' },
  { key: 'mailingState', label: 'State', type: 'text' },
  { key: 'title', label: 'Title', type: 'text' },
]

export const OPERATORS = [
  { key: 'equals', label: 'Equals' },
  { key: 'not_equals', label: 'Not Equals' },
  { key: 'contains', label: 'Contains' },
  { key: 'greater_than', label: 'Greater Than' },
  { key: 'less_than', label: 'Less Than' },
  { key: 'includes', label: 'Includes' },
]

export const DUMMY_SEGMENTATIONS = [
  {
    id: 1,
    name: 'Test',
    description: 'Test',
    status: 'Planned',
    contactCount: 425,
    createdDate: '2026-03-20',
    startDate: null,
    endDate: null,
    owner: 'Cameron Abernethy',
    filters: [
      { field: 'salary', operator: 'greater_than', value: '100000' },
    ],
  },
  {
    id: 2,
    name: 'High Balance Participants',
    description: 'Participants with plan balances over $500K',
    status: 'Active',
    contactCount: 87,
    createdDate: '2026-03-15',
    startDate: '2026-03-16',
    endDate: null,
    owner: 'Cameron Abernethy',
    filters: [
      { field: 'planBalance', operator: 'greater_than', value: '500000' },
    ],
  },
  {
    id: 3,
    name: 'New Hires 2026',
    description: 'Employees hired in 2026',
    status: 'Active',
    contactCount: 34,
    createdDate: '2026-03-10',
    startDate: '2026-03-10',
    endDate: null,
    owner: 'Cameron Abernethy',
    filters: [
      { field: 'daysSinceEntry', operator: 'less_than', value: '90' },
    ],
  },
  {
    id: 4,
    name: 'California Employees',
    description: 'All participants in CA',
    status: 'Planned',
    contactCount: 112,
    createdDate: '2026-03-08',
    startDate: null,
    endDate: null,
    owner: 'Cameron Abernethy',
    filters: [
      { field: 'mailingState', operator: 'equals', value: 'CA' },
    ],
  },
]
