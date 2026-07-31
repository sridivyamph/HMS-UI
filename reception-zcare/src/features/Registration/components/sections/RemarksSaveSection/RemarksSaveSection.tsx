import { Plus } from 'lucide-react';
import type { PatientFormData } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
}

export function RemarksSaveSection({ formData, onChange }: Props) {
  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Remarks & Save
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-normal">
          Add any additional notes, then complete the registration.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-1.5">
        <label
          htmlFor="remarks"
          className="text-xs font-medium text-slate-600"
        >
          Remarks
        </label>
        <textarea
          id="remarks"
          rows={6}
          placeholder="Any additional notes for the front-office or clinical team..."
          value={formData.remarks}
          onChange={(e) => onChange('remarks', e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#05b875] focus:ring-2 focus:ring-emerald-500/10 resize-y min-h-[140px]"
        />
      </div>
    </>
  );
}

export function SaveRegistrationLabel() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Plus className="w-4 h-4" />
      Save Registration
    </span>
  );
}
