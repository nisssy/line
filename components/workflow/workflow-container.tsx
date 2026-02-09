"use client"

import { useState } from "react"
import { Stepper } from "@/components/workflow/stepper"
import { Step1Sales } from "@/components/workflow/steps/step1-sales"
import { Step1Office } from "@/components/workflow/steps/step1-office"
import { Step2Sales } from "@/components/workflow/steps/step2-sales"
import { Step2Office } from "@/components/workflow/steps/step2-office"
import { Step3Sales } from "@/components/workflow/steps/step3-sales"
import { Step3Office } from "@/components/workflow/steps/step3-office"
import type { UserRole, WorkflowState, WorkflowStep, BasicInfo, SelectedAccount } from "@/types/workflow"

interface WorkflowContainerProps {
  role: UserRole
  onStatusChange?: (status: "preparing" | "skipped") => void
}

const initialBasicInfo: BasicInfo = {
  companyName: "",
  hallName: "",
  representativeName: "",
  email: "",
  phone: "",
  address: "",
  businessType: "",
  adBudget: "",
  commission: "",
  startDate: "",
  endDate: "",
  areaSpecification: "",
  targetAudience: "",
  ageGroup: "",
  gender: "",
  notes: "",
}

const initialState: WorkflowState = {
  currentStep: 1,
  policyDecided: false,
  policySkipped: false,
  step1Status: "pending",
  step2Status: "pending",
  basicInfo: initialBasicInfo,
  intermediateReports: [
    { id: "1", title: "中間報告1" },
  ],
  finalReport: undefined,
}

export function WorkflowContainer({ role, onStatusChange }: WorkflowContainerProps) {
  const [state, setState] = useState<WorkflowState>(initialState)

  const completedSteps: WorkflowStep[] = []
  if (state.step1Status === "approved") {
    completedSteps.push(1)
  }
  if (state.step2Status === "success") {
    completedSteps.push(2)
  }

  // Policy handlers
  const handleProceedWithDelivery = () => {
    setState((prev) => ({ ...prev, policyDecided: true, policySkipped: false }))
    onStatusChange?.("preparing")
  }

  const handleSkipDelivery = () => {
    setState((prev) => ({ ...prev, policyDecided: true, policySkipped: true }))
    onStatusChange?.("skipped")
  }

  // Step 1 handlers
  const handleBasicInfoChange = (info: BasicInfo) => {
    setState((prev) => ({ ...prev, basicInfo: info }))
  }

  const handleSendApplication = () => {
    console.log("[v0] Application sent to customer")
  }

  const handleUploadApplication = (file: File) => {
    // Simulate extracting info from uploaded file
    setState((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        companyName: "株式会社サンプル",
        hallName: "サンプル店",
        representativeName: "山田 太郎",
        email: "yamada@example.com",
        phone: "03-1234-5678",
        address: "北海道札幌市西区発寒6条9丁目3番1号",
        businessType: "パチンコ・パチスロ店",
        adBudget: "500,000円",
        commission: "100,000円",
        startDate: "2026-03-01",
        endDate: "2026-03-31",
        areaSpecification: "北海道札幌市西区発寒6条9丁目3番1号より半径5km",
        targetAudience: "この地域に住んでいる人",
        ageGroup: "すべて",
        gender: "指定なし",
        notes: "",
      },
    }))
  }

  const handleRequestReview = () => {
    setState((prev) => ({ ...prev, step1Status: "awaiting_review" }))
  }

  const handleApproveStep1 = () => {
    setState((prev) => ({ ...prev, step1Status: "approved", currentStep: 2 }))
  }

  const handleRejectStep1 = (reason: string) => {
    setState((prev) => ({
      ...prev,
      step1Status: "rejected",
      step1RejectionReason: reason,
    }))
  }

  // Step 2 handlers
  const handleStep2Reply = (content: string) => {
    setState((prev) => ({ ...prev, step2Status: "pending", step2SalesReply: content }))
  }

  const handleSendCustomerInquiry = (content: string) => {
    console.log("[v0] Customer inquiry sent:", content)
  }

  const handleMarkAsApplied = () => {
    console.log("[v0] Marked as applied")
  }

  const handleStep2Complete = () => {
    setState((prev) => ({ ...prev, step2Status: "success", currentStep: 3 }))
  }

  const handleStep2SelectAccount = (account: SelectedAccount) => {
    setState((prev) => ({ ...prev, step2Status: "success", step2SelectedAccount: account, currentStep: 3 }))
  }

  const handleStep2ResetAccount = () => {
    setState((prev) => ({ ...prev, step2Status: "pending", step2SelectedAccount: undefined, currentStep: 2 }))
  }

  const handleRequestConfirmation = (content: string) => {
    setState((prev) => ({
      ...prev,
      step2Status: "failed",
      step2ConfirmationMessage: content,
    }))
  }

  // Step 3 handlers
  const handleUploadIntermediateReport = (reportId: string, file: File) => {
    setState((prev) => ({
      ...prev,
      intermediateReports: prev.intermediateReports.map((report) =>
        report.id === reportId
          ? { ...report, fileName: file.name, uploadedAt: new Date().toISOString() }
          : report
      ),
    }))
  }

  const handleAddIntermediateReport = () => {
    const newId = String(state.intermediateReports.length + 1)
    setState((prev) => ({
      ...prev,
      intermediateReports: [
        ...prev.intermediateReports,
        { id: newId, title: `中間報告${newId}` },
      ],
    }))
  }

  const handleUploadFinalReport = (file: File) => {
    setState((prev) => ({
      ...prev,
      finalReport: {
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    }))
  }

  const handleSaveIntermediateReport = (reportId: string) => {
    setState((prev) => ({
      ...prev,
      intermediateReports: prev.intermediateReports.map((report) =>
        report.id === reportId
          ? { ...report, saved: true }
          : report
      ),
    }))
  }

  const handleSaveFinalReport = () => {
    setState((prev) => ({
      ...prev,
      finalReport: prev.finalReport
        ? { ...prev.finalReport, saved: true }
        : undefined,
    }))
  }

  const handleLoadSampleIntermediateReport = (reportId: string, fileName: string) => {
    setState((prev) => ({
      ...prev,
      intermediateReports: prev.intermediateReports.map((report) =>
        report.id === reportId
          ? { ...report, fileName, uploadedAt: new Date().toISOString() }
          : report
      ),
    }))
  }

  const handleLoadSampleFinalReport = (fileName: string) => {
    setState((prev) => ({
      ...prev,
      finalReport: {
        fileName,
        uploadedAt: new Date().toISOString(),
      },
    }))
  }

  const handleStepClick = (step: WorkflowStep) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  const handleSendIntermediateReport = (reportId: string, content: string) => {
    console.log("[v0] Sending intermediate report email:", reportId, content)
    setState((prev) => ({
      ...prev,
      intermediateReports: prev.intermediateReports.map((report) =>
        report.id === reportId ? { ...report, sentToCustomer: true } : report
      ),
    }))
  }

  const handleSendFinalReport = (content: string) => {
    console.log("[v0] Sending final report email:", content)
    setState((prev) => ({
      ...prev,
      finalReport: prev.finalReport
        ? { ...prev.finalReport, sentToCustomer: true }
        : undefined,
    }))
  }

  return (
    <div className="space-y-8">
      <Stepper currentStep={state.currentStep} completedSteps={completedSteps} onStepClick={handleStepClick} />

      <div className="mx-auto max-w-3xl">
        {/* Step 1 */}
        {state.currentStep === 1 && role === "sales" && (
          <Step1Sales
            status={state.step1Status}
            rejectionReason={state.step1RejectionReason}
            basicInfo={state.basicInfo}
            policyDecided={state.policyDecided}
            policySkipped={state.policySkipped}
            onBasicInfoChange={handleBasicInfoChange}
            onSendApplication={handleSendApplication}
            onUploadApplication={handleUploadApplication}
            onRequestReview={handleRequestReview}
            onProceedWithDelivery={handleProceedWithDelivery}
            onSkipDelivery={handleSkipDelivery}
          />
        )}

        {state.currentStep === 1 && role === "office" && (
          <Step1Office
            status={state.step1Status}
            basicInfo={state.basicInfo}
            onApprove={handleApproveStep1}
            onReject={handleRejectStep1}
          />
        )}

        {/* Step 2 */}
        {state.currentStep === 2 && role === "sales" && (
          <Step2Sales
            status={state.step2Status}
            confirmationMessage={state.step2ConfirmationMessage}
            onReply={handleStep2Reply}
            onSendCustomerInquiry={handleSendCustomerInquiry}
          />
        )}

        {state.currentStep === 2 && role === "office" && (
          <Step2Office
            status={state.step2Status}
            salesReply={state.step2SalesReply}
            selectedAccount={state.step2SelectedAccount}
            onMarkAsApplied={handleMarkAsApplied}
            onComplete={handleStep2Complete}
            onSelectAccount={handleStep2SelectAccount}
            onResetAccount={handleStep2ResetAccount}
            onRequestConfirmation={handleRequestConfirmation}
          />
        )}

        {/* Step 3 */}
        {state.currentStep === 3 && role === "sales" && (
          <Step3Sales
            intermediateReports={state.intermediateReports}
            finalReport={state.finalReport}
            onSendIntermediateReport={handleSendIntermediateReport}
            onSendFinalReport={handleSendFinalReport}
          />
        )}

        {state.currentStep === 3 && role === "office" && (
          <Step3Office
            intermediateReports={state.intermediateReports}
            finalReport={state.finalReport}
            onUploadIntermediateReport={handleUploadIntermediateReport}
            onAddIntermediateReport={handleAddIntermediateReport}
            onUploadFinalReport={handleUploadFinalReport}
            onSaveIntermediateReport={handleSaveIntermediateReport}
            onSaveFinalReport={handleSaveFinalReport}
            onLoadSampleIntermediateReport={handleLoadSampleIntermediateReport}
            onLoadSampleFinalReport={handleLoadSampleFinalReport}
          />
        )}
      </div>
    </div>
  )
}
