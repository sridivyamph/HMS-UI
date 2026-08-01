import React from 'react';

export interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

function getCircleClass(isActive: boolean, isCompleted: boolean) {
  if (isActive) {
    return 'bg-[#05b875] text-white border-2 border-[#05b875] shadow-sm';
  }
  if (isCompleted) {
    return 'bg-[#e3f6ed] border-2 border-[#05b875] text-[#05b875]';
  }
  return 'bg-white border-2 border-slate-200 text-slate-400';
}

function getLabelClass(isActive: boolean, isCompleted: boolean) {
  if (isActive) {
    return 'text-slate-900 font-bold';
  }
  if (isCompleted) {
    return 'text-slate-500 font-medium';
  }
  return 'text-slate-400 font-medium';
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <>
      {/* Mobile: vertical layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;
          const lineFilled = index < currentStep;

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onStepClick?.(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer transition-transform hover:scale-105 ${getCircleClass(
                    isActive,
                    isCompleted,
                  )}`}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Go to ${step.label}`}
                >
                  {step.id}
                </button>
                {!isLast && (
                  <div
                    className={`w-0.5 h-8 transition-colors ${
                      lineFilled ? 'bg-[#05b875]' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                className={`text-xs pt-1.5 text-left cursor-pointer ${getLabelClass(
                  isActive,
                  isCompleted,
                )}`}
              >
                {step.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Desktop/tablet: horizontal layout */}
      <div className="hidden md:flex items-start w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;
          // Line after this step turns green once we move to the next step
          const lineFilled = index < currentStep;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                className="flex flex-col items-center shrink-0 cursor-pointer group max-w-24"
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Go to ${step.label}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:scale-105 ${getCircleClass(
                    isActive,
                    isCompleted,
                  )}`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-[11px] text-center mt-1.5 leading-tight ${getLabelClass(
                    isActive,
                    isCompleted,
                  )}`}
                >
                  {step.label}
                </span>
              </button>

              {!isLast && (
                <div className="flex-1 min-w-4 h-10 flex items-center px-2">
                  <div
                    className={`w-full h-0.5 transition-colors duration-300 ${
                      lineFilled ? 'bg-[#05b875]' : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default Stepper;
