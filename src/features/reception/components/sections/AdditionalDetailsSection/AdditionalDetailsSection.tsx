import {
  MARITAL_STATUS_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  CATEGORY_OPTIONS,
  RELIGION_OPTIONS,
  OCCUPATION_OPTIONS,
  LANGUAGE_OPTIONS,
  LIVING_ARRANGEMENT_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
} from '../../../constants';
import { Input, Select, Badge } from '@/shared/components/ui';
import type { PatientFormData } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
}

export function AdditionalDetailsSection({ formData, onChange }: Props) {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <Badge>ADDITIONAL DETAILS</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-5">
        <Input
          label="Family Name"
          placeholder="e.g. Al Farsi"
          value={formData.familyName}
          onChange={(e) => onChange('familyName', e.target.value)}
        />

        <Input
          label="Mother's Maiden Name"
          placeholder="Mother's maiden name"
          value={formData.mothersMaidenName}
          onChange={(e) => onChange('mothersMaidenName', e.target.value)}
        />

        <Select
          label="Marital Status"
          value={formData.maritalStatus}
          onChange={(e) => onChange('maritalStatus', e.target.value)}
          options={MARITAL_STATUS_OPTIONS}
        />

        <Select
          label="Blood Group"
          value={formData.bloodGroup}
          onChange={(e) => onChange('bloodGroup', e.target.value)}
          options={BLOOD_GROUP_OPTIONS}
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => onChange('category', e.target.value)}
          options={CATEGORY_OPTIONS}
        />

        <Select
          label="Religion"
          value={formData.religion}
          onChange={(e) => onChange('religion', e.target.value)}
          options={RELIGION_OPTIONS}
        />

        <Select
          label="Occupation"
          value={formData.occupation}
          onChange={(e) => onChange('occupation', e.target.value)}
          options={OCCUPATION_OPTIONS}
        />

        <Input
          label="Job Title"
          placeholder="e.g. Senior Engineer"
          value={formData.jobTitle}
          onChange={(e) => onChange('jobTitle', e.target.value)}
        />

        <Input
          label="Organization"
          placeholder="Employer / Organization"
          value={formData.organization}
          onChange={(e) => onChange('organization', e.target.value)}
        />

        <Select
          label="Language"
          value={formData.language}
          onChange={(e) => onChange('language', e.target.value)}
          options={LANGUAGE_OPTIONS}
        />

        <Select
          label="Living Arrangement"
          value={formData.livingArrangement}
          onChange={(e) => onChange('livingArrangement', e.target.value)}
          options={LIVING_ARRANGEMENT_OPTIONS}
        />

        <Select
          label="Preferred Language"
          value={formData.preferredLanguage}
          onChange={(e) => onChange('preferredLanguage', e.target.value)}
          options={PREFERRED_LANGUAGE_OPTIONS}
        />
      </div>
    </>
  );
}
