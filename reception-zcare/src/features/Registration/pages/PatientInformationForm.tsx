import { usePatientForm } from '../hooks/usePatientForm';
import { Card } from '../../../components/Card/Card';
import { Button } from '../../../components/Button/Button';
import { BasicInformationSection } from '../components/BasicInformationSection';
import { AdditionalDetailsSection } from '../components/AdditionalDetailsSection';
import { IdentifiableInformationSection } from '../components/IdentifiableInformationSection';

export function PatientInformationForm() {
  const { formData, handleChange, handleDobChange, handlePhotoUpload, reset } =
    usePatientForm();

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            New In-Patient Registration
          </h3>
          <p className="text-slate-500 text-xs font-medium tracking-tight mt-1">
            Fields marked <span className="text-rose-500 font-bold">*</span> are
            mandatory. Patient details below stay visible while you complete the
            rest of the form.
          </p>
        </div>
        <Button onClick={reset}>Clear Form</Button>
      </div>

      <Card>
        <BasicInformationSection
          formData={formData}
          onChange={handleChange}
          onDobChange={handleDobChange}
          onPhotoUpload={handlePhotoUpload}
        />

        <div className="border-t border-slate-100 my-7" />

        <AdditionalDetailsSection
          formData={formData}
          onChange={handleChange}
        />

        <div className="border-t border-slate-100 my-7" />

        <IdentifiableInformationSection
          formData={formData}
          onChange={handleChange}
        />
      </Card>
    </div>
  );
}
