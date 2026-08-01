import { Input, Select } from '@/shared/components/ui';
import { DocumentCopyUpload } from '@/shared/components/common';
import { IDENTIFYING_DOCUMENT_OPTIONS } from '../../../constants';
import type { PatientFormData } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
  onDocumentCopyUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentIdentificationSection({
  formData,
  onChange,
  onDocumentCopyUpload,
}: Props) {
  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Document Identification
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-normal">
          Primary identity document used to verify the patient.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-5">
        <Select
          label="Identifying Document Name"
          required
          value={formData.identifyingDocumentName}
          onChange={(e) => onChange('identifyingDocumentName', e.target.value)}
          options={IDENTIFYING_DOCUMENT_OPTIONS}
          placeholder="Select"
        />
        <Input
          label="Document Number"
          required
          value={formData.documentNumber}
          onChange={(e) => onChange('documentNumber', e.target.value)}
        />
        <Input
          label="Issued Place"
          value={formData.issuedPlace}
          onChange={(e) => onChange('issuedPlace', e.target.value)}
        />
        <Input
          label="Issued Date"
          type="date"
          value={formData.issuedDate}
          onChange={(e) => onChange('issuedDate', e.target.value)}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-5">
        <Input
          label="Valid From"
          type="date"
          value={formData.validFrom}
          onChange={(e) => onChange('validFrom', e.target.value)}
        />
        <Input
          label="Valid To"
          type="date"
          value={formData.validTo}
          onChange={(e) => onChange('validTo', e.target.value)}
        />
        <DocumentCopyUpload
          fileName={formData.documentCopyName}
          onUpload={onDocumentCopyUpload}
        />
      </div>
    </>
  );
}
