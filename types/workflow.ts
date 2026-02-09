export type UserRole = "sales" | "office"

export type ProjectStatus = "confirmed" | "in_progress" | "pending" | "completed" | "preparing" | "skipped"

export interface Project {
  id: string
  code: string
  status: ProjectStatus
  companyName: string
  hallName: string
  date: string
  location: string
  budget: number
  createdAt: string
}

export type Step1Status =
  | "pending"
  | "awaiting_review"
  | "rejected"
  | "approved"

export type Step2Status = "pending" | "success" | "failed"

export type WorkflowStep = 1 | 2 | 3

export interface BasicInfo {
  companyName: string
  hallName: string
  representativeName: string
  email: string
  phone: string
  address: string
  businessType: string
  adBudget: string
  commission: string
  startDate: string
  endDate: string
  areaSpecification: string
  targetAudience: string
  ageGroup: string
  gender: string
  notes: string
}

export interface IntermediateReport {
  id: string
  title: string
  fileUrl?: string
  fileName?: string
  uploadedAt?: string
  sentToCustomer?: boolean
  saved?: boolean
}

export interface SelectedAccount {
  id: string
  name: string
  accountId: string
}

export interface WorkflowState {
  currentStep: WorkflowStep
  policyDecided: boolean
  policySkipped: boolean
  step1Status: Step1Status
  step1RejectionReason?: string
  step2Status: Step2Status
  step2ConfirmationMessage?: string
  step2SalesReply?: string
  step2SelectedAccount?: SelectedAccount
  basicInfo: BasicInfo
  intermediateReports: IntermediateReport[]
  finalReport?: {
    fileUrl?: string
    fileName?: string
    uploadedAt?: string
    sentToCustomer?: boolean
    saved?: boolean
  }
}
