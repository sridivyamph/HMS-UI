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
  // Contact Information
  email: string;
  alternateEmail: string;
  communicationType: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  // Document Identification
  identifyingDocumentName: string;
  documentNumber: string;
  issuedPlace: string;
  issuedDate: string;
  validFrom: string;
  validTo: string;
  documentCopyUrl: string | null;
  documentCopyName: string | null;
  // Insurance & Coverage
  tpa: boolean;
  miscCompanyType: boolean;
  showExpiredPlans: boolean;
  insurance: string;
  corporate: string;
  companyType: string;
  companyName: string;
  planName: string;
  priority: string;
  employeeNo: string;
  membershipNo: string;
  policyNo: string;
  policyHolder: string;
  insuranceValidFrom: string;
  insuranceValidTo: string;
  certificateNo: string;
  dependentMemberNo: string;
  insuranceRelation: string;
  // Emergency / Guardian
  emergencyType: string;
  emergencyMrNo: string;
  emergencyFirstName: string;
  emergencyMiddleName: string;
  emergencyLastName: string;
  emergencyFamilyName: string;
  emergencyGender: string;
  emergencyRelation: string;
  emergencyMobileCountryCode: string;
  emergencyMobileNo: string;
  emergencyAltCountryCode: string;
  emergencyAltNo: string;
  emergencyEmail: string;
  emergencyAlternateEmail: string;
  emergencySameAsPatientAddress: boolean;
  emergencyAddressLine1: string;
  emergencyAddressLine2: string;
  emergencyAddressLine3: string;
  emergencyCountry: string;
  emergencyState: string;
  emergencyCity: string;
  emergencyPincode: string;
  linkFamilyMrNo: string;
  linkFamilyFullName: string;
  linkFamilyRelation: string;
  linkedFamilyMembers: LinkedFamilyMember[];
  // Documents
  documentCategory: string;
  documentSubCategory: string;
  documentFileName: string | null;
  documentFileUrl: string | null;
  supportingDocuments: SupportingDocument[];
  // Remarks
  remarks: string;
}

export interface LinkedFamilyMember {
  id: string;
  mrNo: string;
  fullName: string;
  relation: string;
}

export interface SupportingDocument {
  id: string;
  category: string;
  subCategory: string;
  fileName: string;
  fileUrl: string;
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
