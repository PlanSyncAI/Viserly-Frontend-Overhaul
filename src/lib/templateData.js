// Mock template data and merge field definitions

export const MERGE_FIELDS = {
  ACCOUNT: [
    { key: 'Account-Name', label: 'Account Name' },
    { key: 'Account-DeferralEligibilityReqs', label: 'Deferral Eligibility Reqs.' },
    { key: 'Account-DeferralEntryDates', label: 'Deferral Entry Dates' },
    { key: 'Account-EstatePlanningWebsite', label: 'Estate Planning Website' },
    { key: 'Account-FinancialWellnessWebsite', label: 'Financial Wellness Website' },
    { key: 'Account-MatchDescription', label: 'Match Description' },
    { key: 'Account-MaxPlanMatch', label: 'Max Plan Match' },
    { key: 'Account-PlanEducationWebsite', label: 'Plan Education Website' },
    { key: 'Account-PlanName', label: 'Plan Name' },
    { key: 'Account-PlanNumber', label: 'Plan Number' },
    { key: 'Account-Recordkeeper', label: 'Recordkeeper' },
    { key: 'Account-RecordkeeperWebsite', label: 'Recordkeeper Website' },
    { key: 'Account-ServiceContactEmail', label: 'Service Contact Email' },
    { key: 'Account-ServiceContactFirstName', label: 'Service Contact First Name' },
    { key: 'Account-ServiceContactLastName', label: 'Service Contact Last Name' },
    { key: 'Account-ServiceContactPhone', label: 'Service Contact Phone' },
    { key: 'Account-ServiceContactTitle', label: 'Service Contact Title' },
    { key: 'Account-VideoLink', label: 'Video Link' },
  ],
  CONTACT: [
    { key: 'Contact-EligibilityStatus', label: 'Eligibility Status' },
    { key: 'Contact-Email', label: 'Email' },
    { key: 'Contact-EmploymentStatus', label: 'Employment Status' },
    { key: 'Contact-EntryDate', label: 'Entry Date' },
    { key: 'Contact-FirstName', label: 'First Name' },
    { key: 'Contact-LastName', label: 'Last Name' },
    { key: 'Contact-MaritalStatus', label: 'Marital Status' },
    { key: 'Contact-Phone', label: 'Phone' },
    { key: 'Contact-PreTaxDeferralRateDollar', label: 'Pre-Tax Deferral Rate $' },
    { key: 'Contact-PreTaxDeferralRatePercent', label: 'Pre-Tax Deferral Rate %' },
    { key: 'Contact-PreferredName', label: 'Preferred Name' },
    { key: 'Contact-RothDeferralRateDollar', label: 'Roth Deferral Rate $' },
    { key: 'Contact-RothDeferralRatePercent', label: 'Roth Deferral Rate %' },
    { key: 'Contact-Title', label: 'Title' },
  ],
  USER: [
    { key: 'User-CalendarLink', label: 'Calendar Link' },
    { key: 'User-Signature', label: 'Signature' },
  ],
}

// Sample values for merge field preview
export const SAMPLE_MERGE_VALUES = {
  'Account-Name': 'Acme Corporation',
  'Account-DeferralEligibilityReqs': '90 days of service',
  'Account-DeferralEntryDates': '1st of each month',
  'Account-EstatePlanningWebsite': 'https://estate.example.com',
  'Account-FinancialWellnessWebsite': 'https://wellness.example.com',
  'Account-MatchDescription': '100% match on the first 3% and 50% on the next 2%',
  'Account-MaxPlanMatch': '4%',
  'Account-PlanEducationWebsite': 'https://education.example.com',
  'Account-PlanName': 'Acme 401(k) Plan',
  'Account-PlanNumber': '12345',
  'Account-Recordkeeper': 'Fidelity Investments',
  'Account-RecordkeeperWebsite': 'https://fidelity.com',
  'Account-ServiceContactEmail': 'jane.smith@viserly.com',
  'Account-ServiceContactFirstName': 'Jane',
  'Account-ServiceContactLastName': 'Smith',
  'Account-ServiceContactPhone': '(555) 123-4567',
  'Account-ServiceContactTitle': 'Plan Advisor',
  'Account-VideoLink': 'https://video.example.com',
  'Contact-EligibilityStatus': 'Eligible',
  'Contact-Email': 'john.doe@example.com',
  'Contact-EmploymentStatus': 'Active',
  'Contact-EntryDate': '01/15/2024',
  'Contact-FirstName': 'John',
  'Contact-LastName': 'Doe',
  'Contact-MaritalStatus': 'Married',
  'Contact-Phone': '(555) 987-6543',
  'Contact-PreTaxDeferralRateDollar': '$500',
  'Contact-PreTaxDeferralRatePercent': '6%',
  'Contact-PreferredName': 'John',
  'Contact-RothDeferralRateDollar': '$200',
  'Contact-RothDeferralRatePercent': '3%',
  'Contact-Title': 'Mr.',
  'User-CalendarLink': 'https://calendly.com/jane-smith',
  'User-Signature': 'Jane Smith\nPlan Advisor | Viserly\njane.smith@viserly.com | (555) 123-4567',
}

export const DUMMY_TEMPLATES = [
  {
    id: 1,
    name: 'Default Trigger Email - 59.5',
    subject: '*[[Contact-PreferredName]]*, You\'ve Hit a Major Retirement Milestone',
    body: `*[[Contact-PreferredName]]*,
Congratulations on reaching an important milestone. Turning 59\u00BD opens up new flexibility around how and when retirement savings can be accessed.
Many participants use this point to better understand what options are now available, whether early retirement is a possibility, and how future income might be structured. Even if no immediate changes are planned, clarity now can make future decisions easier.
If it would be helpful, a brief 30-minute conversation can walk through what this milestone means for you and answer any questions you may have.
Click here to schedule: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: 'Viserly',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '4:37 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:06 AM',
  },
  {
    id: 2,
    name: 'Default Trigger Email - Age 50 Catch-Up',
    subject: 'Turning 50! Turbo-Charge Savings with Catch-Up Contributions',
    body: `*[[Contact-PreferredName]]*,
Happy 50th birthday! This milestone comes with a valuable benefit: you're now eligible for catch-up contributions to your *[[Account-PlanName]]*.
Starting this year, you can contribute an additional amount above the standard limit, giving you a powerful tool to accelerate your retirement savings during your peak earning years.
Here's a quick snapshot of your current savings:
- Current pre-tax deferral rate: *[[Contact-PreTaxDeferralRatePercent]]*
- Current Roth deferral rate: *[[Contact-RothDeferralRatePercent]]*
- Your employer match: *[[Account-MatchDescription]]*
Even a modest increase in contributions now can make a meaningful difference by the time you retire. If you'd like to discuss strategies for maximizing your catch-up contributions, I'm here to help.
Click here to schedule a conversation: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: '',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '4:42 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:10 AM',
  },
  {
    id: 3,
    name: 'Default Trigger Email - Backdoor Roth',
    subject: 'Roth IRA eligibility changes at your income level\u2014here\'s what to know',
    body: `*[[Contact-PreferredName]]*,
As your income grows, direct Roth IRA contributions may no longer be available due to IRS income limits. But that doesn't mean Roth savings are off the table.
A backdoor Roth strategy allows high earners to still take advantage of tax-free growth by making after-tax contributions and converting them. Your *[[Account-PlanName]]* through *[[Account-Name]]* may offer features that support this approach.
Here's what to consider:
- Your current pre-tax deferral: *[[Contact-PreTaxDeferralRatePercent]]*
- Your current Roth deferral: *[[Contact-RothDeferralRatePercent]]*
- Employer match available: *[[Account-MaxPlanMatch]]*
Understanding how to structure your contributions across pre-tax, Roth, and after-tax buckets can help you build a more tax-efficient retirement. This is especially valuable if you expect to be in a higher tax bracket in retirement.
I'd be happy to walk through the details in a quick conversation.
Click here to schedule: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: 'Viserly',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '4:45 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:12 AM',
  },
  {
    id: 4,
    name: 'Default Trigger Email - Birthday',
    subject: 'Happy Birthday *[[Contact-PreferredName]]*! Another Year, Another Opportunity',
    body: `*[[Contact-PreferredName]]*,
Happy Birthday! We hope you have a wonderful day.
A new year is a great time to check in on your financial goals. Whether it's reviewing your contribution rate, exploring your investment options, or simply confirming your beneficiaries are up to date, even small adjustments can have a big impact over time.
Here's a quick look at where things stand:
- Your plan: *[[Account-PlanName]]*
- Current pre-tax deferral rate: *[[Contact-PreTaxDeferralRatePercent]]*
- Employer match: *[[Account-MatchDescription]]*
If you'd like to take a few minutes to review your retirement plan and make sure everything is on track, I'm happy to help.
Click here to schedule a conversation: *[[User-CalendarLink]]*
Wishing you a great year ahead!
*[[User-Signature]]*`,
    source: 'Viserly',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '4:50 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:15 AM',
  },
  {
    id: 5,
    name: 'Default Trigger Email - Five Years Out from Retirement',
    subject: 'Happy Birthday! Five-Year Countdown and Time to Optimize Every Dollar',
    body: `*[[Contact-PreferredName]]*,
Happy Birthday! With retirement approximately five years away, this is an important window for planning.
The decisions you make over the next few years can significantly impact your financial security in retirement. Now is the time to:
- Review your asset allocation and consider whether it reflects your timeline
- Maximize contributions, including catch-up contributions if you're over 50
- Understand your Social Security options and projected benefits
- Evaluate your healthcare coverage plan for the transition
- Confirm your beneficiary designations are current
Your current savings snapshot:
- Plan: *[[Account-PlanName]]* with *[[Account-Recordkeeper]]*
- Pre-tax deferral rate: *[[Contact-PreTaxDeferralRatePercent]]*
- Roth deferral rate: *[[Contact-RothDeferralRatePercent]]*
A 30-minute conversation now can help you map out a clear path to retirement. I'd love to help you make the most of these final working years.
Click here to schedule: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: '',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '4:55 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:18 AM',
  },
  {
    id: 6,
    name: 'Default Trigger Email - Medicare Message (64.5)',
    subject: 'Medicare Prep Starts Soon. Avoid Late Enrollment Penalties',
    body: `*[[Contact-PreferredName]]*,
As you approach your 65th birthday, it's important to start thinking about Medicare enrollment. Your Initial Enrollment Period begins three months before you turn 65, and missing key deadlines can result in late enrollment penalties that last for years.
Here's what you should know:
- Medicare Part A (hospital insurance) is typically premium-free if you've paid Medicare taxes for at least 10 years
- Medicare Part B (medical insurance) requires a monthly premium and you must actively enroll
- Medicare Part D (prescription drug coverage) has its own enrollment window
- If you're still working and covered by employer insurance, special rules may apply
Even if you plan to continue working past 65, understanding how Medicare coordinates with your employer benefits through *[[Account-Name]]* is essential.
For personalized guidance on your retirement healthcare transition, I'm happy to schedule a conversation.
Click here to schedule: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: '',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '5:00 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:20 AM',
  },
  {
    id: 7,
    name: 'Default Trigger Email - One Year Out from Retirement',
    subject: 'Happy Birthday! The 12-Month Checklist and Retirement Age Starts Next Year',
    body: `*[[Contact-PreferredName]]*,
Happy Birthday! With just one year until your expected retirement, it's time to finalize your transition plan.
This is the year to get specific about the details. Here's a checklist to consider:
- Confirm your target retirement date with HR at *[[Account-Name]]*
- Review your projected retirement income from all sources
- Finalize your Social Security claiming strategy
- Ensure your healthcare coverage is lined up (Medicare, supplemental, or COBRA)
- Review and update your beneficiary designations
- Consider your distribution strategy from your *[[Account-PlanName]]*
- Meet with a tax advisor about the tax implications of your first year of retirement
Your current plan details:
- Recordkeeper: *[[Account-Recordkeeper]]*
- Pre-tax deferral rate: *[[Contact-PreTaxDeferralRatePercent]]*
- Employer match: *[[Account-MatchDescription]]*
I'd love to sit down with you and walk through each of these items to make sure nothing falls through the cracks.
Click here to schedule: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: '',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '5:05 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:22 AM',
  },
  {
    id: 8,
    name: 'Default Trigger Email - Rehire',
    subject: 'Welcome Back to *[[Account-Name]]*! Let\'s Reboot Your Retirement Plan',
    body: `*[[Contact-PreferredName]]*,
Welcome back to *[[Account-Name]]*! We're glad to have you on the team again.
As a returning employee, you may already be eligible to participate in the *[[Account-PlanName]]*. Here are a few things to check as you get settled:
- Your previous account balance may still be with *[[Account-Recordkeeper]]*
- Review your contribution elections to make sure they're set where you want them
- Confirm your beneficiary designations are up to date
- Check if your previous service counts toward vesting
Plan details:
- Deferral eligibility: *[[Account-DeferralEligibilityReqs]]*
- Entry dates: *[[Account-DeferralEntryDates]]*
- Employer match: *[[Account-MatchDescription]]*
If you'd like help getting your retirement plan back on track, I'm happy to walk you through everything.
Click here to schedule a conversation: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: 'Viserly',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '5:10 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:25 AM',
  },
  {
    id: 9,
    name: 'Default Trigger Email - Retirement Age (65)',
    subject: 'Happy 65th! Secure Your Financial Plan for Retirement',
    body: `*[[Contact-PreferredName]]*,
Happy 65th birthday! This is a major milestone, and whether retirement is right around the corner or still a few years away, turning 65 brings important decisions.
Key items to address at 65:
- Medicare enrollment: Your Initial Enrollment Period is now open. Make sure you understand Parts A, B, and D
- Social Security: If you haven't already, now is a good time to review your claiming options
- Required Minimum Distributions: These will begin at age 73, but planning ahead ensures a smooth transition
- Tax planning: Consider the tax implications of drawing from different account types (pre-tax, Roth, taxable)
Your current plan snapshot:
- Plan: *[[Account-PlanName]]*
- Recordkeeper: *[[Account-Recordkeeper]]*
- Pre-tax deferral: *[[Contact-PreTaxDeferralRatePercent]]*
- Roth deferral: *[[Contact-RothDeferralRatePercent]]*
Whether you're retiring soon or planning to work a few more years, a quick conversation can help you stay on top of everything.
Click here to schedule: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: '',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '5:15 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:28 AM',
  },
  {
    id: 10,
    name: 'Default Trigger Email - Ten Years Out from Retirement',
    subject: '*[[Contact-PreferredName]]*, Happy Birthday! Let\'s Map Your Final Decade to Financial Freedom',
    body: `*[[Contact-PreferredName]]*,
Happy Birthday! With approximately ten years until your expected retirement, you're entering a critical planning window.
The next decade is when the groundwork you lay can have the greatest impact. Here's what to focus on:
- Maximize contributions: Are you contributing enough to get the full employer match of *[[Account-MaxPlanMatch]]*?
- Catch-up contributions: If you're 50 or older, you can contribute extra each year
- Investment review: Your asset allocation should start reflecting your shorter time horizon
- Debt reduction: Aim to minimize high-interest debt before retirement
- Emergency fund: Ensure you have 6-12 months of expenses saved outside your retirement accounts
Your current savings details:
- Plan: *[[Account-PlanName]]* (Plan #*[[Account-PlanNumber]]*)
- Recordkeeper: *[[Account-Recordkeeper]]*
- Current pre-tax deferral: *[[Contact-PreTaxDeferralRatePercent]]*
- Current Roth deferral: *[[Contact-RothDeferralRatePercent]]*
- Employer match: *[[Account-MatchDescription]]*
A proactive conversation now can set you up for a confident retirement. Let's talk about your goals and build a plan to get there.
Click here to schedule: *[[User-CalendarLink]]*
*[[User-Signature]]*`,
    source: '',
    isDefault: true,
    createdBy: 'support',
    createdDate: '2025-05-20',
    createdTime: '5:20 PM',
    lastModifiedBy: 'support',
    lastModifiedDate: '2026-01-20',
    lastModifiedTime: '4:30 AM',
  },
]
