export interface PatientFormData {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  age: string;
  manualAgeOverride: boolean;
  mobileCountryCode: string;
  mobileNo: string;
  altCountryCode: string;
  altNo: string;
  nationality: string;
  photoUrl: string | null;
  familyName: string;
  mothersMaidenName: string;
  maritalStatus: string;
  bloodGroup: string;
  category: string;
  religion: string;
  occupation: string;
  jobTitle: string;
  organization: string;
  language: string;
  livingArrangement: string;
  preferredLanguage: string;
  medicallyChallenged: boolean;
  physicallyChallenged: boolean;
  hearingImpaired: boolean;
  visuallyImpaired: boolean;
  speechImpaired: boolean;
}

export type IdentifiableKey =
  | 'medicallyChallenged'
  | 'physicallyChallenged'
  | 'hearingImpaired'
  | 'visuallyImpaired'
  | 'speechImpaired';

export interface IdentifiableItem {
  key: IdentifiableKey;
  label: string;
}
