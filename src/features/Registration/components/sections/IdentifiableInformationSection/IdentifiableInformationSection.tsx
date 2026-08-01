import { Badge, CheckboxPill } from '@/components/ui';
import type { PatientFormData, IdentifiableKey } from '../../../types';

interface Props {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean | null) => void;
}

const IDENTIFIABLE_ITEMS: { key: IdentifiableKey; label: string }[] = [
  { key: 'medicallyChallenged', label: 'Medically Challenged' },
  { key: 'physicallyChallenged', label: 'Physically Challenged' },
  { key: 'hearingImpaired', label: 'Hearing Impaired' },
  { key: 'visuallyImpaired', label: 'Visually Impaired' },
  { key: 'speechImpaired', label: 'Speech Impaired' },
];

export function IdentifiableInformationSection({ formData, onChange }: Props) {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <Badge>IDENTIFIABLE INFORMATION</Badge>
      </div>
      <div className="flex flex-wrap gap-3">
        {IDENTIFIABLE_ITEMS.map(({ key, label }) => (
          <CheckboxPill
            key={key}
            checked={formData[key]}
            onChange={(checked) => onChange(key, checked)}
            label={label}
          />
        ))}
      </div>
    </>
  );
}
