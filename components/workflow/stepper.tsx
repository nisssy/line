"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WorkflowStep } from "@/types/workflow"

interface StepperProps {
  currentStep: WorkflowStep
  completedSteps: WorkflowStep[]
  onStepClick?: (step: WorkflowStep) => void
}

const steps = [
  { step: 1, label: "基本情報登録" },
  { step: 2, label: "LINE広告アカウント登録" },
  { step: 3, label: "配信レポート作成" },
]

export function Stepper({ currentStep, completedSteps, onStepClick }: StepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <button
              type="button"
              onClick={() => onStepClick?.(step.step as WorkflowStep)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors",
                  completedSteps.includes(step.step as WorkflowStep)
                    ? "border-primary bg-primary text-primary-foreground group-hover:bg-primary/90"
                    : currentStep === step.step
                      ? "border-primary bg-primary/10 text-primary group-hover:bg-primary/20"
                      : "border-muted-foreground/30 bg-muted text-muted-foreground group-hover:border-muted-foreground/50 group-hover:bg-muted/80"
                )}
              >
                {completedSteps.includes(step.step as WorkflowStep) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.step
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm font-medium whitespace-nowrap transition-colors",
                  currentStep === step.step ||
                    completedSteps.includes(step.step as WorkflowStep)
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground/80"
                )}
              >
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-0.5 w-16 lg:w-24",
                  completedSteps.includes(step.step as WorkflowStep)
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
