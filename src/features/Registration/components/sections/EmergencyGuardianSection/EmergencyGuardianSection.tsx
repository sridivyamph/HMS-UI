import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import {
  GENDER_OPTIONS,
  COUNTRY_CODE_OPTIONS,
  COUNTRY_OPTIONS,
  STATE_OPTIONS_BY_COUNTRY,
  CITY_OPTIONS_BY_STATE,
  EMERGENCY_TYPE_OPTIONS,
  EMERGENCY_RELATION_OPTIONS,
} from '../../../constants';
import { Input, Select, Button } from '@/components/ui';
import type { PatientFormData } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
  onAddFamilyMember: () => void;
  onRemoveFamilyMember: (id: string) => void;
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

const INPUT_CLASS =
  'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#05b875] focus:ring-2 focus:ring-emerald-500/10';

const MOCK_MR_LOOKUP: Record<string, string> = {
  MR1001: 'Aisha Al Farsi',
  MR1002: 'Omar Hassan',
  MR1003: 'Priya Sharma',
};

export function EmergencyGuardianSection({
  formData,
  onChange,
  onAddFamilyMember,
  onRemoveFamilyMember,
}: Props) {
  const addressLocked = formData.emergencySameAsPatientAddress;
  const stateOptions = formData.emergencyCountry
    ? (STATE_OPTIONS_BY_COUNTRY[formData.emergencyCountry] ?? [])
    : [];
  const cityOptions = formData.emergencyState
    ? (CITY_OPTIONS_BY_STATE[formData.emergencyState] ?? [])
    : [];

  const handleSameAsPatient = (checked: boolean) => {
    onChange('emergencySameAsPatientAddress', checked);
    if (checked) {
      onChange('emergencyAddressLine1', formData.addressLine1);
      onChange('emergencyAddressLine2', formData.addressLine2);
      onChange('emergencyAddressLine3', formData.addressLine3);
      onChange('emergencyCountry', formData.country);
      onChange('emergencyState', formData.state);
      onChange('emergencyCity', formData.city);
      onChange('emergencyPincode', formData.pincode);
    }
  };

  const handleCountryChange = (country: string) => {
    onChange('emergencyCountry', country);
    onChange('emergencyState', '');
    onChange('emergencyCity', '');
  };

  const handleStateChange = (state: string) => {
    onChange('emergencyState', state);
    onChange('emergencyCity', '');
  };

  const handleLinkMrChange = (mrNo: string) => {
    onChange('linkFamilyMrNo', mrNo);
    const key = mrNo.trim().toUpperCase();
    onChange('linkFamilyFullName', MOCK_MR_LOOKUP[key] ?? '');
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Emergency / Guardian / Other Contact
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-normal">
          A contact person for emergencies, plus any family members already
          registered with Zcare.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-5">
        <Select
          label="Type"
          required
          value={formData.emergencyType}
          onChange={(e) => onChange('emergencyType', e.target.value)}
          options={EMERGENCY_TYPE_OPTIONS}
          placeholder="Select"
        />
        <Input
          label="MR No (if already a patient)"
          placeholder="e.g. MR1001"
          value={formData.emergencyMrNo}
          onChange={(e) => onChange('emergencyMrNo', e.target.value)}
        />
        <Input
          label="First Name"
          required
          value={formData.emergencyFirstName}
          onChange={(e) => onChange('emergencyFirstName', e.target.value)}
        />
        <Input
          label="Middle Name"
          value={formData.emergencyMiddleName}
          onChange={(e) => onChange('emergencyMiddleName', e.target.value)}
        />
        <Input
          label="Last Name"
          value={formData.emergencyLastName}
          onChange={(e) => onChange('emergencyLastName', e.target.value)}
        />
        <Input
          label="Family Name"
          value={formData.emergencyFamilyName}
          onChange={(e) => onChange('emergencyFamilyName', e.target.value)}
        />
        <Select
          label="Gender"
          value={formData.emergencyGender}
          onChange={(e) => onChange('emergencyGender', e.target.value)}
          options={GENDER_OPTIONS}
          placeholder="Select"
        />
        <Select
          label="Relation"
          value={formData.emergencyRelation}
          onChange={(e) => onChange('emergencyRelation', e.target.value)}
          options={EMERGENCY_RELATION_OPTIONS}
          placeholder="Select"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Mobile Number</label>
          <div className="flex gap-2">
            <CountryCodeSelect
              value={formData.emergencyMobileCountryCode}
              onChange={(value) => onChange('emergencyMobileCountryCode', value)}
            />
            <input
              type="tel"
              placeholder="98765 43210"
              value={formData.emergencyMobileNo}
              onChange={(e) => onChange('emergencyMobileNo', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            Alternate Mobile No
          </label>
          <div className="flex gap-2">
            <CountryCodeSelect
              value={formData.emergencyAltCountryCode}
              onChange={(value) => onChange('emergencyAltCountryCode', value)}
            />
            <input
              type="tel"
              value={formData.emergencyAltNo}
              onChange={(e) => onChange('emergencyAltNo', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.emergencyEmail}
          onChange={(e) => onChange('emergencyEmail', e.target.value)}
        />
        <Input
          label="Alternate Email"
          type="email"
          value={formData.emergencyAlternateEmail}
          onChange={(e) => onChange('emergencyAlternateEmail', e.target.value)}
        />
      </div>

      <div className="border-t border-slate-100 my-7" />

      <p className="text-[11px] font-extrabold tracking-wider uppercase text-[#058a58] mb-4">
        Address
      </p>

      <label className="flex items-center gap-2 mb-5 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={formData.emergencySameAsPatientAddress}
          onChange={(e) => handleSameAsPatient(e.target.checked)}
          className="rounded border-slate-300 text-[#05b875] focus:ring-emerald-500 w-4 h-4"
        />
        <span className="text-sm text-slate-600">Same as patient address</span>
      </label>

      <div className="grid grid-cols-1 gap-y-4 gap-x-5">
        <Input
          label="Address Line 1"
          value={formData.emergencyAddressLine1}
          onChange={(e) => onChange('emergencyAddressLine1', e.target.value)}
          disabled={addressLocked}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5">
        <Input
          label="Address Line 2"
          value={formData.emergencyAddressLine2}
          onChange={(e) => onChange('emergencyAddressLine2', e.target.value)}
          disabled={addressLocked}
        />
        <Input
          label="Address Line 3"
          value={formData.emergencyAddressLine3}
          onChange={(e) => onChange('emergencyAddressLine3', e.target.value)}
          disabled={addressLocked}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-5">
        <Select
          label="Country"
          required
          value={formData.emergencyCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          options={COUNTRY_OPTIONS}
          placeholder="Select Country"
          disabled={addressLocked}
        />
        <Select
          label="State / Region"
          required
          value={formData.emergencyState}
          onChange={(e) => handleStateChange(e.target.value)}
          options={stateOptions}
          placeholder={
            formData.emergencyCountry ? 'Select State' : 'Select Country first'
          }
          disabled={addressLocked || !formData.emergencyCountry}
        />
        <Select
          label="City"
          required
          value={formData.emergencyCity}
          onChange={(e) => onChange('emergencyCity', e.target.value)}
          options={cityOptions}
          placeholder={
            formData.emergencyState ? 'Select City' : 'Select State first'
          }
          disabled={addressLocked || !formData.emergencyState}
        />
        <Input
          label="Pincode"
          required
          value={formData.emergencyPincode}
          onChange={(e) => onChange('emergencyPincode', e.target.value)}
          disabled={addressLocked}
        />
      </div>

      <div className="border-t border-slate-100 my-7" />

      <p className="text-[11px] font-extrabold tracking-wider uppercase text-[#058a58]">
        Linked Family Members
      </p>
      <p className="text-slate-400 text-xs mt-1 mb-5">
        Search an existing Zcare patient by MR number and link them as a family
        member.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] gap-y-4 gap-x-5 items-end">
        <Input
          label="MR No"
          required
          placeholder="e.g. MR1001"
          value={formData.linkFamilyMrNo}
          onChange={(e) => handleLinkMrChange(e.target.value)}
        />
        <Input
          label="Full Name"
          placeholder="Auto-populated"
          value={formData.linkFamilyFullName}
          readOnly
          className="bg-slate-100/70 text-slate-500 cursor-not-allowed"
        />
        <Select
          label="Relation"
          required
          value={formData.linkFamilyRelation}
          onChange={(e) => onChange('linkFamilyRelation', e.target.value)}
          options={EMERGENCY_RELATION_OPTIONS}
          placeholder="Select"
        />
        <Button
          variant="primary"
          onClick={onAddFamilyMember}
          className="flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#e3f6ed] text-[#058a58] text-[11px] font-extrabold tracking-wider uppercase">
            <tr>
              <th className="px-4 py-3">MR No</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Relation</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.linkedFamilyMembers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No family members linked yet.
                </td>
              </tr>
            ) : (
              formData.linkedFamilyMembers.map((member) => (
                <tr key={member.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{member.mrNo}</td>
                  <td className="px-4 py-3 text-slate-700">{member.fullName}</td>
                  <td className="px-4 py-3 text-slate-700">{member.relation}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemoveFamilyMember(member.id)}
                      className="text-rose-500 hover:text-rose-600 p-1"
                      aria-label={`Remove ${member.fullName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
