import type { Step } from '@/components/common';

export const REGISTRATION_STEPS: Step[] = [
  { id: 1, label: 'Contact Information' },
  { id: 2, label: 'Document Identification' },
  { id: 3, label: 'Insurance & Coverage' },
  { id: 4, label: 'Emergency / Guardian' },
  { id: 5, label: 'Documents' },
  { id: 6, label: 'Remarks & Save' },
];

export const STEP_INDEX = {
  CONTACT: 0,
  DOCUMENT_ID: 1,
  INSURANCE: 2,
  EMERGENCY: 3,
  DOCUMENTS: 4,
  REMARKS: 5,
} as const;
