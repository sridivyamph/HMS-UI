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

  const reset = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  return { formData, handleChange, handleDobChange, handlePhotoUpload, reset };
}
