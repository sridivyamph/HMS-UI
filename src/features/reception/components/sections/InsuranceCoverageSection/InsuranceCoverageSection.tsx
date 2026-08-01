import {
  INSURANCE_OPTIONS,
  CORPORATE_OPTIONS,
  COMPANY_TYPE_OPTIONS,
  COMPANY_NAME_OPTIONS,
  PLAN_NAME_OPTIONS,
  PRIORITY_OPTIONS,
  INSURANCE_RELATION_OPTIONS,
} from '../../../constants';
import { Input, Select, CheckboxPill } from '@/shared/components/ui';
import type { PatientFormData } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
}

export function InsuranceCoverageSection({ formData, onChange }: Props) {
  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Insurance & Other Information
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-normal">
          Coverage, plan and policy details, if applicable.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <CheckboxPill
          checked={formData.tpa}
          onChange={(checked) => onChange('tpa', checked)}
          label="TPA"
        />
        <CheckboxPill
          checked={formData.miscCompanyType}
          onChange={(checked) => onChange('miscCompanyType', checked)}
          label="Misc Company Type"
        />
        <CheckboxPill
          checked={formData.showExpiredPlans}
          onChange={(checked) => onChange('showExpiredPlans', checked)}
          label="Show Expired Plans"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-5">
        <Select
          label="Insurance"
          required
          value={formData.insurance}
          onChange={(e) => onChange('insurance', e.target.value)}
          options={INSURANCE_OPTIONS}
          placeholder="Select"
        />
        <Select
          label="Corporate"
          required
          value={formData.corporate}
          onChange={(e) => onChange('corporate', e.target.value)}
          options={CORPORATE_OPTIONS}
          placeholder="Select"
        />
        <Select
          label="Company Type"
          required
          value={formData.companyType}
          onChange={(e) => onChange('companyType', e.target.value)}
          options={COMPANY_TYPE_OPTIONS}
          placeholder="Select"
        />
        <Select
          label="Company Name"
          required
          value={formData.companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
          options={COMPANY_NAME_OPTIONS}
          placeholder="Select"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-5">
        <Select
          label="Plan Name"
          required
          value={formData.planName}
          onChange={(e) => onChange('planName', e.target.value)}
          options={PLAN_NAME_OPTIONS}
          placeholder="Select"
        />
        <Select
          label="Priority"
          required
          value={formData.priority}
          onChange={(e) => onChange('priority', e.target.value)}
          options={PRIORITY_OPTIONS}
          placeholder="Select"
        />
        <Input
          label="Employee No"
          value={formData.employeeNo}
          onChange={(e) => onChange('employeeNo', e.target.value)}
        />
        <Input
          label="Membership No"
          value={formData.membershipNo}
          onChange={(e) => onChange('membershipNo', e.target.value)}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-5">
        <Input
          label="Policy No"
          value={formData.policyNo}
          onChange={(e) => onChange('policyNo', e.target.value)}
        />
        <Input
          label="Policy Holder (As Per Card)"
          value={formData.policyHolder}
          onChange={(e) => onChange('policyHolder', e.target.value)}
        />
        <Input
          label="Valid From"
          type="date"
          value={formData.insuranceValidFrom}
          onChange={(e) => onChange('insuranceValidFrom', e.target.value)}
        />
        <Input
          label="Valid To"
          required
          type="date"
          value={formData.insuranceValidTo}
          onChange={(e) => onChange('insuranceValidTo', e.target.value)}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-5">
        <Input
          label="Certificate No"
          value={formData.certificateNo}
          onChange={(e) => onChange('certificateNo', e.target.value)}
        />
        <Input
          label="Dependent Member No"
          value={formData.dependentMemberNo}
          onChange={(e) => onChange('dependentMemberNo', e.target.value)}
        />
        <Select
          label="Relation"
          value={formData.insuranceRelation}
          onChange={(e) => onChange('insuranceRelation', e.target.value)}
          options={INSURANCE_RELATION_OPTIONS}
          placeholder="Select"
        />
      </div>
    </>
  );
}
