import { useState, useCallback } from 'react';
import type { PatientFormData } from '../types/patient';

const INITIAL_FORM_STATE: PatientFormData = {
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dob: '',
  age: '',
  manualAgeOverride: false,
  mobileCountryCode: '+91',
  mobileNo: '',
  altCountryCode: '+91',
  altNo: '',
  nationality: '',
  photoUrl: null,
  familyName: '',
  mothersMaidenName: '',
  maritalStatus: '',
  bloodGroup: '',
  category: '',
  religion: '',
  occupation: '',
  jobTitle: '',
  organization: '',
  language: '',
  livingArrangement: '',
  preferredLanguage: '',
  medicallyChallenged: false,
  physicallyChallenged: false,
  hearingImpaired: false,
  visuallyImpaired: false,
  speechImpaired: false,
  email: '',
  alternateEmail: '',
  communicationType: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  identifyingDocumentName: '',
  documentNumber: '',
  issuedPlace: '',
  issuedDate: '',
  validFrom: '',
  validTo: '',
  documentCopyUrl: null,
  documentCopyName: null,
  tpa: false,
  miscCompanyType: false,
  showExpiredPlans: false,
  insurance: '',
  corporate: '',
  companyType: '',
  companyName: '',
  planName: '',
  priority: '',
  employeeNo: '',
  membershipNo: '',
  policyNo: '',
  policyHolder: '',
  insuranceValidFrom: '',
  insuranceValidTo: '',
  certificateNo: '',
  dependentMemberNo: '',
  insuranceRelation: '',
  emergencyType: '',
  emergencyMrNo: '',
  emergencyFirstName: '',
  emergencyMiddleName: '',
  emergencyLastName: '',
  emergencyFamilyName: '',
  emergencyGender: '',
  emergencyRelation: '',
  emergencyMobileCountryCode: '+91',
  emergencyMobileNo: '',
  emergencyAltCountryCode: '+91',
  emergencyAltNo: '',
  emergencyEmail: '',
  emergencyAlternateEmail: '',
  emergencySameAsPatientAddress: false,
  emergencyAddressLine1: '',
  emergencyAddressLine2: '',
  emergencyAddressLine3: '',
  emergencyCountry: '',
  emergencyState: '',
  emergencyCity: '',
  emergencyPincode: '',
  linkFamilyMrNo: '',
  linkFamilyFullName: '',
  linkFamilyRelation: '',
  linkedFamilyMembers: [],
  documentCategory: '',
  documentSubCategory: '',
  documentFileName: null,
  documentFileUrl: null,
  supportingDocuments: [],
  remarks: '',
};

function calculateAge(dob: string): string {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
}

export function usePatientForm() {
  const [formData, setFormData] = useState<PatientFormData>(INITIAL_FORM_STATE);

  const handleChange = useCallback(
    (field: keyof PatientFormData, value: string | boolean | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleDobChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      dob: value,
      age: calculateAge(value),
    }));
  }, []);

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, photoUrl: url }));
      }
    },
    [],
  );

  const handleDocumentCopyUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          documentCopyUrl: url,
          documentCopyName: file.name,
        }));
      }
    },
    [],
  );

  const handleSupportingDocumentUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          documentFileUrl: url,
          documentFileName: file.name,
        }));
      }
    },
    [],
  );

  const addLinkedFamilyMember = useCallback(() => {
    setFormData((prev) => {
      if (!prev.linkFamilyMrNo.trim() || !prev.linkFamilyRelation) return prev;
      return {
        ...prev,
        linkedFamilyMembers: [
          ...prev.linkedFamilyMembers,
          {
            id: crypto.randomUUID(),
            mrNo: prev.linkFamilyMrNo.trim(),
            fullName: prev.linkFamilyFullName.trim() || 'Unknown',
            relation: prev.linkFamilyRelation,
          },
        ],
        linkFamilyMrNo: '',
        linkFamilyFullName: '',
        linkFamilyRelation: '',
      };
    });
  }, []);

  const removeLinkedFamilyMember = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      linkedFamilyMembers: prev.linkedFamilyMembers.filter((m) => m.id !== id),
    }));
  }, []);

  const addSupportingDocument = useCallback(() => {
    setFormData((prev) => {
      if (!prev.documentCategory || !prev.documentSubCategory || !prev.documentFileName) {
        return prev;
      }
      return {
        ...prev,
        supportingDocuments: [
          ...prev.supportingDocuments,
          {
            id: crypto.randomUUID(),
            category: prev.documentCategory,
            subCategory: prev.documentSubCategory,
            fileName: prev.documentFileName,
            fileUrl: prev.documentFileUrl ?? '',
          },
        ],
        documentCategory: '',
        documentSubCategory: '',
        documentFileName: null,
        documentFileUrl: null,
      };
    });
  }, []);

  const removeSupportingDocument = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.filter((d) => d.id !== id),
    }));
  }, []);

  const reset = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  return {
    formData,
    handleChange,
    handleDobChange,
    handlePhotoUpload,
    handleDocumentCopyUpload,
    handleSupportingDocumentUpload,
    addLinkedFamilyMember,
    removeLinkedFamilyMember,
    addSupportingDocument,
    removeSupportingDocument,
    reset,
  };
}
