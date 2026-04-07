export type CompanyData = {
  id: number
  companyId: string
  name: string
  email?: string
}

export type HallData = {
  id: number
  hallId: string
  name: string
  salesPersonName: string
  companyId: number
  discountAmount: number
  address?: string
  email?: string
  prefecture?: string
}

export type EmployeeData = {
  id: number
  name: string
  email: string
  department?: string
}

export type UserRole = "sales" | "office"

export type ProjectStatus = "confirmed" | "in_progress" | "pending" | "completed" | "preparing" | "skipped"

// 案件詳細画面のステータス（提案中、進行中、完了）
export type ProjectDetailStatus = "proposing" | "in_progress" | "completed"

// レコードのステータス
export type RecordStatus =
  | "pre_proposal"         // 提案前
  | "office_applying"      // [事務] 申請中
  | "office_approved"      // [事務] 事務承認
  | "agency_pending"       // [代理店様] 受領待ち
  | "agency_reviewing"     // [代理店様] 審査中
  | "in_progress"          // 進行中
  | "completed"            // 完了

export interface Project {
  id: string
  code: string
  name: string
  status: ProjectStatus
  detailStatus: ProjectDetailStatus
  companyName: string
  companyId: string
  hallName?: string
  hallId?: string
  salesRep: string
  date: string
  location: string
  budget: number
  createdAt: string
  materialCount: number
  category?: string
  division?: string
  area?: string
  department?: string
}

// 商材名の選択肢
export const MATERIAL_NAME_OPTIONS = [
  "LINE広告",
]

// レコード（フラット化されたデータ）
export interface RecordData {
  id: string
  recordNumber: string
  recordTitle: string
  projectId: string
  projectNumber: string
  status: RecordStatus
  statusLabel: string
  orderDate: string
  storeCode: string
  storeName: string
  publicationStartDate: string
  publicationEndDate: string
  publicationDays: number
  netAmount: number
  dailyBudget: number
  deliveryArea: string
  target: string
  materialCategory: string
  materialName: string
  campaignObjective?: string
  billingMethod?: string
}

// 保存された検索条件
export interface SavedSearchCondition {
  id: string
  name: string
  conditions: {
    company?: string
    hall?: string
    department?: string
    area?: string
    departmentArea?: string
    prefectures?: string[]
    areas?: string[]
    departments?: string[]
    materialCategory?: string
    materialName?: string
    statuses?: string[]
    projectNumber?: string
    projectCode?: string
    recordNumber?: string
    projectName?: string
    salesRep?: string
    dateFrom?: string
    dateTo?: string
  }
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
  // 追加項目
  anniversaryPack: boolean
  hallBillingAmount: string
  previousCarryover: string
  selectedPackId?: string
  selectedPackTitle?: string
}
export interface CarryoverItem {
  id: string
  startDate: string
  endDate: string
  amount: number | null
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

export interface Supervisor {
  id: string
  name: string
  role: "sales" | "office"
}

export interface ChatMessage {
  id: string
  sender: "sales" | "office"
  senderName: string
  content: string
  timestamp: string
  escalatedTo?: Supervisor[]
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
  step1ChatHistory: ChatMessage[]
  chatHistory: ChatMessage[]
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
