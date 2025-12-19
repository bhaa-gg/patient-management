import { OptionType } from './types'

export const GenderOptions = ['Male', 'Female', 'Other']

export const PatientFormDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: new Date(Date.now()),
  gender: 'Male' as Gender,
  address: '',
  occupation: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  primaryPhysician: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  allergies: '',
  currentMedication: '',
  familyMedicalHistory: '',
  pastMedicalHistory: '',
  identificationType: 'Birth Certificate',
  identificationNumber: '',
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
}

export const IdentificationTypes: OptionType[] = [
  {
    label: 'Birth Certificate',
    value: 'birth_certificate',
  },
  {
    label: "Driver's License",
    value: 'drivers_license',
  },
  {
    label: 'Medical Insurance Card/Policy',
    value: 'medical_insurance_card_policy',
  },
  {
    label: 'Military ID Card',
    value: 'military_id_card',
  },
  {
    label: 'National Identity Card',
    value: 'national_identity_card',
  },
  {
    label: 'Passport',
    value: 'passport',
  },
  {
    label: 'Resident Alien Card (Green Card)',
    value: 'resident_alien_card',
  },
  {
    label: 'Social Security Card',
    value: 'social_security_card',
  },
  {
    label: 'State ID Card',
    value: 'state_id_card',
  },
  {
    label: 'Student ID Card',
    value: 'student_id_card',
  },
  {
    label: 'Voter ID Card',
    value: 'voter_id_card',
  },
]

export const Doctors: OptionType[] = [
  {
    imgSrc: '/assets/images/dr-green.png',
    label: 'John Green',
    value: 'John Green',
  },
  {
    imgSrc: '/assets/images/dr-cameron.png',
    label: 'Leila Cameron',
    value: 'Leila Cameron',
  },
  {
    imgSrc: '/assets/images/dr-livingston.png',
    label: 'David Livingston',
    value: 'David Livingston',
  },
  {
    imgSrc: '/assets/images/dr-peter.png',
    label: 'Evan Peter',
    value: 'Evan Peter',
  },
  {
    imgSrc: '/assets/images/dr-powell.png',
    label: 'Jane Powell',
    value: 'Jane Powell',
  },
  {
    imgSrc: '/assets/images/dr-remirez.png',
    label: 'Alex Ramirez',
    value: 'Alex Ramirez',
  },
  {
    imgSrc: '/assets/images/dr-lee.png',
    label: 'Jasmine Lee',
    value: 'Jasmine Lee',
  },
  {
    imgSrc: '/assets/images/dr-cruz.png',
    label: 'Alyana Cruz',
    value: 'Alyana Cruz',
  },
  {
    imgSrc: '/assets/images/dr-sharma.png',
    label: 'Hardik Sharma',
    value: 'Hardik Sharma',
  },
]

export const StatusIcon = {
  scheduled: '/assets/icons/check.svg',
  pending: '/assets/icons/pending.svg',
  cancelled: '/assets/icons/cancelled.svg',
}
