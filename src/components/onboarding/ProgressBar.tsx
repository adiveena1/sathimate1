// Progress bar component for onboarding steps
'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ title: string; description?: string }>;
}

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="w-full px-4 py-8 bg-gradient-to-r from-emerald-50 to-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={index} className="flex items-center flex-1">
                {/* Step circle */}
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-white text-emerald-600 border-2 border-emerald-500 shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded-full transition-all duration-300
                      ${isCompleted ? 'bg-emerald-500' : 'bg-gray-300'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step title and description */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {steps[currentStep - 1].title}
          </h2>
          {steps[currentStep - 1].description && (
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
