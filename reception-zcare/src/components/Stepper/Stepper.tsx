import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const StepItem: React.FC<{
  step: Step;
  index: number;
  currentStep: number;
  isLast: boolean;
}> = ({ step, index, currentStep, isLast }) => {
  const isCompleted = index < currentStep;
  const isActive = index === currentStep;
  return (
    <div className="flex items-center flex-1 min-w-0">
      <div className="flex flex-col items-center w-full">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0 ${
            isActive
              ? 'bg-[#05b875] text-white shadow-md'
              : isCompleted
              ? 'bg-[#e3f6ed] border-2 border-[#05b875] text-[#05b875]'
              : 'bg-white border-2 border-slate-200 text-slate-400'
          }`}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : step.id}
        </div>
        <span
          className={`text-[11px] font-bold text-center mt-1.5 leading-tight max-w-24 ${
            isActive
              ? 'text-[#05b875]'
              : isCompleted
              ? 'text-[#058a58]'
              : 'text-slate-400'
          }`}
        >
          {step.label}
        </span>
      </div>
      {!isLast && (
        <div
          className={`flex-1 h-0.5 self-start mt-[19px] mx-2 ${
            isCompleted ? 'bg-[#05b875]' : 'bg-slate-200'
          }`}
        />
      )}
    </div>
  );
};

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <>
      {/* Mobile: vertical layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-[#05b875] text-white shadow-md'
                      : isCompleted
                      ? 'bg-[#e3f6ed] border-2 border-[#05b875] text-[#05b875]'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-8 ${
                      isCompleted ? 'bg-[#05b875]' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-xs font-semibold pt-1.5 ${
                  isActive
                    ? 'text-[#05b875]'
                    : isCompleted
                    ? 'text-[#058a58]'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Desktop/tablet: horizontal layout */}
      <div className="hidden md:flex items-start justify-between w-full gap-0">
        {steps.map((step, index) => (
          <StepItem
            key={step.id}
            step={step}
            index={index}
            currentStep={currentStep}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </>
  );
};

export default Stepper;
