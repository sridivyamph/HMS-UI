import {
  COMMUNICATION_TYPE_OPTIONS,
  COUNTRY_OPTIONS,
  STATE_OPTIONS_BY_COUNTRY,
  CITY_OPTIONS_BY_STATE,
} from '../../../constants';
import { Input, Select } from '@/shared/components/ui';
import type { PatientFormData } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
}

export function ContactInformationSection({ formData, onChange }: Props) {
  const stateOptions = formData.country
    ? (STATE_OPTIONS_BY_COUNTRY[formData.country] ?? [])
    : [];
  const cityOptions = formData.state
    ? (CITY_OPTIONS_BY_STATE[formData.state] ?? [])
    : [];

  const handleCountryChange = (country: string) => {
    onChange('country', country);
    onChange('state', '');
    onChange('city', '');
  };

  const handleStateChange = (state: string) => {
    onChange('state', state);
    onChange('city', '');
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Contact Information
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-normal">
          How and where to reach the patient.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-5">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        <Input
          label="Alternate Email"
          type="email"
          value={formData.alternateEmail}
          onChange={(e) => onChange('alternateEmail', e.target.value)}
        />
        <Select
          label="Communication Type"
          value={formData.communicationType}
          onChange={(e) => onChange('communicationType', e.target.value)}
          options={COMMUNICATION_TYPE_OPTIONS}
          placeholder="Select"
        />
      </div>

      <div className="border-t border-slate-100 my-7" />

      <p className="text-[11px] font-extrabold tracking-wider uppercase text-[#058a58] mb-5">
        Address
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5">
        <Input
          label="Address Line 1"
          value={formData.addressLine1}
          onChange={(e) => onChange('addressLine1', e.target.value)}
        />
        <Input
          label="Address Line 2"
          value={formData.addressLine2}
          onChange={(e) => onChange('addressLine2', e.target.value)}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-5">
        <Input
          label="Address Line 3"
          value={formData.addressLine3}
          onChange={(e) => onChange('addressLine3', e.target.value)}
        />
        <Select
          label="Country"
          required
          value={formData.country}
          onChange={(e) => handleCountryChange(e.target.value)}
          options={COUNTRY_OPTIONS}
          placeholder="Select Country"
        />
        <Select
          label="State / Region"
          required
          value={formData.state}
          onChange={(e) => handleStateChange(e.target.value)}
          options={stateOptions}
          placeholder={formData.country ? 'Select State' : 'Select Country first'}
          disabled={!formData.country}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5">
        <Select
          label="City"
          required
          value={formData.city}
          onChange={(e) => onChange('city', e.target.value)}
          options={cityOptions}
          placeholder={formData.state ? 'Select City' : 'Select State first'}
          disabled={!formData.state}
        />
        <Input
          label="Pincode"
          required
          value={formData.pincode}
          onChange={(e) => onChange('pincode', e.target.value)}
        />
      </div>
    </>
  );
}
