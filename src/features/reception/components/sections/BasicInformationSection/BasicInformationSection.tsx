import { ChevronDown } from 'lucide-react';
import { Input, Select, Badge } from '@/shared/components/ui';
import { PhotoUpload } from '@/shared/components/common';
import {
  TITLE_OPTIONS,
  GENDER_OPTIONS,
  COUNTRY_CODE_OPTIONS,
  NATIONALITY_OPTIONS,
} from '../../../constants';
import type { PatientFormData } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
  onDobChange: (value: string) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-24 shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-2.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#05b875] cursor-pointer pr-7"
      >
        {COUNTRY_CODE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

const INPUT_CLASS = 'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#05b875] focus:ring-2 focus:ring-emerald-500/10';

export function BasicInformationSection({
  formData,
  onChange,
  onDobChange,
  onPhotoUpload,
}: Props) {
  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Patient Information
        </h1>
        <Badge>ALWAYS VISIBLE</Badge>
      </div>
      <p className="text-slate-400 text-xs mt-1 font-normal">
        Demographic and personal details of the patient.
      </p>

      <div className="mt-6 flex flex-col lg:flex-row gap-8 items-start">
        <PhotoUpload photoUrl={formData.photoUrl} onUpload={onPhotoUpload} />

        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-5">
          <Select
            label="Title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            options={TITLE_OPTIONS}
          />

          <Input
            label="First Name"
            required
            placeholder="e.g. Aisha"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
          />

          <Input
            label="Middle Name"
            value={formData.middleName}
            onChange={(e) => onChange('middleName', e.target.value)}
          />

          <Input
            label="Last Name"
            required
            placeholder="e.g. Al Farsi"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
          />

          <Select
            label="Gender"
            required
            value={formData.gender}
            onChange={(e) => onChange('gender', e.target.value)}
            options={GENDER_OPTIONS}
          />

          <Input
            label="Date of Birth"
            required
            type="date"
            value={formData.dob}
            onChange={(e) => onDobChange(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Age</label>
            <input
              type="text"
              value={formData.age}
              readOnly={!formData.manualAgeOverride}
              onChange={(e) => onChange('age', e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition ${formData.manualAgeOverride
                ? 'bg-white border-slate-200 text-slate-800 focus:border-[#05b875]'
                : 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            />
            <label className="flex items-center gap-2 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.manualAgeOverride}
                onChange={(e) => onChange('manualAgeOverride', e.target.checked)}
                className="rounded border-slate-300 text-[#05b875] focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span className="text-xs text-slate-500">Enable manual override</span>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Mobile No <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <CountryCodeSelect
                value={formData.mobileCountryCode}
                onChange={(value) => onChange('mobileCountryCode', value)}
              />
              <input
                type="tel"
                placeholder="98765 43210"
                value={formData.mobileNo}
                onChange={(e) => onChange('mobileNo', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Alternate No</label>
            <div className="flex gap-2">
              <CountryCodeSelect
                value={formData.altCountryCode}
                onChange={(value) => onChange('altCountryCode', value)}
              />
              <input
                type="tel"
                value={formData.altNo}
                onChange={(e) => onChange('altNo', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <Select
            label="Nationality"
            value={formData.nationality}
            onChange={(e) => onChange('nationality', e.target.value)}
            options={NATIONALITY_OPTIONS}
          />
        </div>
      </div>
    </>
  );
}
