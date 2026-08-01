import { useState } from 'react';
import { usePatientForm } from '../hooks/usePatientForm';
import { Button, Card } from '@/shared/components/ui';
import { Stepper } from '@/shared/components/common';
import { BasicInformationSection } from '../components/sections/BasicInformationSection/BasicInformationSection';
import { AdditionalDetailsSection } from '../components/sections/AdditionalDetailsSection/AdditionalDetailsSection';
import { IdentifiableInformationSection } from '../components/sections/IdentifiableInformationSection/IdentifiableInformationSection';
import { ContactInformationSection } from '../components/sections/ContactInformationSection/ContactInformationSection';
import { DocumentIdentificationSection } from '../components/sections/DocumentIdentificationSection/DocumentIdentificationSection';
import { InsuranceCoverageSection } from '../components/sections/InsuranceCoverageSection/InsuranceCoverageSection';
import { EmergencyGuardianSection } from '../components/sections/EmergencyGuardianSection/EmergencyGuardianSection';
import { DocumentsSection } from '../components/sections/DocumentsSection/DocumentsSection';
import {
  RemarksSaveSection,
  SaveRegistrationLabel,
} from '../components/sections/RemarksSaveSection/RemarksSaveSection';
import {
  REGISTRATION_STEPS,
  STEP_INDEX,
} from '../constants/registrationSteps';

export function PatientInformationForm() {
  const {
    formData,
    handleChange,
    handleDobChange,
    handlePhotoUpload,
    handleDocumentCopyUpload,
    handleSupportingDocumentUpload,
    addLinkedFamilyMember,
    removeLinkedFamilyMember,
    addSupportingDocument,
    removeSupportingDocument,
    reset,
  } = usePatientForm();
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === REGISTRATION_STEPS.length - 1;

  const goNext = () => {
    if (!isLastStep) setCurrentStep((step) => step + 1);
  };

  const goBack = () => {
    if (!isFirstStep) setCurrentStep((step) => step - 1);
  };

  const handleSave = () => {
    // Registration save will be wired to API later
  };

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

      <Card>
        <Stepper
          steps={REGISTRATION_STEPS}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </Card>

      <Card>
        {currentStep === STEP_INDEX.CONTACT && (
          <ContactInformationSection
            formData={formData}
            onChange={handleChange}
          />
        )}

        {currentStep === STEP_INDEX.DOCUMENT_ID && (
          <DocumentIdentificationSection
            formData={formData}
            onChange={handleChange}
            onDocumentCopyUpload={handleDocumentCopyUpload}
          />
        )}

        {currentStep === STEP_INDEX.INSURANCE && (
          <InsuranceCoverageSection
            formData={formData}
            onChange={handleChange}
          />
        )}

        {currentStep === STEP_INDEX.EMERGENCY && (
          <EmergencyGuardianSection
            formData={formData}
            onChange={handleChange}
            onAddFamilyMember={addLinkedFamilyMember}
            onRemoveFamilyMember={removeLinkedFamilyMember}
          />
        )}

        {currentStep === STEP_INDEX.DOCUMENTS && (
          <DocumentsSection
            formData={formData}
            onChange={handleChange}
            onFileUpload={handleSupportingDocumentUpload}
            onAdd={addSupportingDocument}
            onRemove={removeSupportingDocument}
          />
        )}

        {currentStep === STEP_INDEX.REMARKS && (
          <RemarksSaveSection formData={formData} onChange={handleChange} />
        )}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100">
          <Button onClick={goBack} disabled={isFirstStep}>
            Back
          </Button>
          {isLastStep ? (
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex items-center justify-center"
            >
              <SaveRegistrationLabel />
            </Button>
          ) : (
            <Button variant="primary" onClick={goNext}>
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
