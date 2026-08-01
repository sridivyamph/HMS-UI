import { Plus, Trash2 } from 'lucide-react';
import { Select, Button } from '@/shared/components/ui';
import { DocumentCopyUpload } from '@/shared/components/common';
import {
  DOCUMENT_CATEGORY_OPTIONS,
  DOCUMENT_SUB_CATEGORY_BY_CATEGORY,
} from '../../../constants';
import type { PatientFormData } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function DocumentsSection({
  formData,
  onChange,
  onFileUpload,
  onAdd,
  onRemove,
}: Props) {
  const subCategoryOptions = formData.documentCategory
    ? (DOCUMENT_SUB_CATEGORY_BY_CATEGORY[formData.documentCategory] ?? [])
    : [];

  const handleCategoryChange = (category: string) => {
    onChange('documentCategory', category);
    onChange('documentSubCategory', '');
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Documents
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-normal">
          Attach any supporting documents against a category and sub-category.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.4fr_auto] gap-y-4 gap-x-5 items-end">
        <Select
          label="Category"
          value={formData.documentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          options={DOCUMENT_CATEGORY_OPTIONS}
          placeholder="Select"
        />
        <Select
          label="Sub Category"
          value={formData.documentSubCategory}
          onChange={(e) => onChange('documentSubCategory', e.target.value)}
          options={subCategoryOptions}
          placeholder={
            formData.documentCategory
              ? 'Select'
              : 'Select category first'
          }
          disabled={!formData.documentCategory}
        />
        <DocumentCopyUpload
          label="File"
          placeholder="Scan / Take Photo / Upload"
          fileName={formData.documentFileName}
          onUpload={onFileUpload}
        />
        <Button
          variant="primary"
          onClick={onAdd}
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
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Sub Category</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.supportingDocuments.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No documents attached yet.
                </td>
              </tr>
            ) : (
              formData.supportingDocuments.map((doc) => (
                <tr key={doc.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{doc.category}</td>
                  <td className="px-4 py-3 text-slate-700">{doc.subCategory}</td>
                  <td className="px-4 py-3 text-slate-700 truncate max-w-[200px]">
                    {doc.fileName}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemove(doc.id)}
                      className="text-rose-500 hover:text-rose-600 p-1"
                      aria-label={`Remove ${doc.fileName}`}
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
