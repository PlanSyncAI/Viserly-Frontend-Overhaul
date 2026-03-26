import { useState, useEffect } from 'react'

function parseCSV(text) {
  // Strip UTF-8 BOM if present
  const clean = text.replace(/^\uFEFF/, '')
  const lines = clean.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = values[i]?.trim() || ''
    })
    return obj
  })
}

function transformContact(raw, index) {
  const employmentActive = raw['Employment Status Active'] === 'true'
  return {
    id: index,
    email: raw['Email'] || '',
    firstName: raw['First Name'] || '',
    lastName: raw['Last Name'] || '',
    middleName: raw['Middle Name'] || '',
    preferredName: raw['Preferred Name'] || '',
    fullName: `${raw['First Name'] || ''} ${raw['Middle Name'] ? raw['Middle Name'] + '. ' : ''}${raw['Last Name'] || ''}`.trim(),
    account: raw['Account Name'] || 'Demo Company ABC',
    birthdate: raw['Birthdate'] || '',
    contactTags: raw['Contact Tags'] || '',
    dateOfRehire: raw['Date of Rehire'] || '',
    description: raw['Description'] || '',
    employeeId: raw['Employee ID'] || '',
    entryDate: raw['Entry Date'] || '',
    genderIdentity: raw['Gender Identity'] || '',
    hoursWorked: raw['Hours Worked'] || '',
    maritalStatus: raw['Marital Status'] || '',
    originalHireDate: raw['Original Hire Date'] || '',
    eligibilityStatus: raw['Participant Eligibility Status'] || '',
    preTaxContribRate: raw['Pre-Tax Contribution Rate %'] || '',
    preTaxContribDollar: raw['Pre-Tax Contribution Rate $'] || '',
    preTaxSalaryDeferral: raw['Pre-Tax Salary Deferral'] || '',
    rothContribDollar: raw['Roth Contribution Rate $'] || '',
    rothContribRate: raw['Roth Contribution Rate %'] || '',
    rothSalaryDeferral: raw['Roth Salary Deferral'] || '',
    salary: parseFloat(raw['Salary ($)']) || 0,
    spanishSpeaker: raw['Spanish Speaker'] || '',
    title: raw['Title'] || '',
    personalPhone: raw['Personal Phone'] || '',
    phone: raw['Phone'] || '',
    salutation: raw['Salutation'] || '',
    personalEmail: raw['Personal Email'] || '',
    mailingCity: raw['Mailing City'] || '',
    mailingPostalCode: raw['Mailing Postal Code'] || '',
    mailingState: raw['Mailing State'] || '',
    mailingStreet: raw['Mailing Street'] || '',
    employmentActive,
    status: employmentActive ? 'Active' : 'Inactive',
    planBalance: parseFloat(raw['Plan Balance ($)']) || 0,
    latestDayOfHire: raw['Latest Day of Hire'] || '',
    dateOfSeparation: raw['Date of Separation'] || '',
    grossCompensation: parseFloat(raw['Salary ($)']) || 0,
  }
}

export function useContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/contacts.csv')
      .then((res) => res.text())
      .then((text) => {
        const raw = parseCSV(text)
        const transformed = raw.map(transformContact)
        setContacts(transformed)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { contacts, loading }
}
