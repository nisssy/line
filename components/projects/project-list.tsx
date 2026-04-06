"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import type { Project, CompanyData, HallData, RecordData, SavedSearchCondition } from "@/types/workflow"
import { MATERIAL_NAME_OPTIONS } from "@/types/workflow"
import { Search, X, Plus, Calendar as CalendarIcon, Check, ChevronsUpDown, Download, Save, Trash2, ChevronDown, ChevronUp, RefreshCw, ArrowRightLeft, Copy } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { initialCompanies, initialHalls, initialEmployees, searchCompanies, searchHalls, DEPARTMENT_OPTIONS, AREA_OPTIONS, MATERIAL_CATEGORY_OPTIONS } from "@/lib/master-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ProjectListProps {
  onSelectProject: (projectId: string) => void
  onSelectRecord: (recordId: string) => void
  onCreateProject: (searchContext?: { company: CompanyData | null; hall: HallData | null }) => void
  onAddMaterial: () => void
  projects: Project[]
  records: RecordData[]
  onDuplicateRecords?: (records: RecordData[], projectId: string) => void
}

// サンプルデータ（マスタデータ整合）
export const sampleProjects: Project[] = [
  {
    id: "1",
    code: "PJ-001",
    name: "パールショップともえ川越店 - 齋藤昌弘",
    status: "confirmed",
    detailStatus: "in_progress",
    companyName: "株式会社ビッグパチンコ",
    companyId: "CORP-010",
    hallName: "パールショップともえ川越店",
    hallId: "CORP-010-HALL-03",
    salesRep: "齋藤昌弘",
    date: "2026-03-16",
    location: "埼玉県川越市",
    budget: 40000,
    createdAt: "2026-03-12",
    materialCount: 2,
    category: "イベント",
    division: "LINE広告",
    area: "東京本社②",
    department: "営業部",
  },
  {
    id: "2",
    code: "PJ-002",
    name: "ユーコーラッキー長崎店 - 佐藤次郎",
    status: "in_progress",
    detailStatus: "proposing",
    companyName: "株式会社ダイナム",
    companyId: "CORP-002",
    hallName: "ユーコーラッキー長崎店",
    hallId: "CORP-002-HALL-02",
    salesRep: "佐藤 次郎",
    date: "2026-03-21",
    location: "長崎県長崎市",
    budget: 20000,
    createdAt: "2026-03-12",
    materialCount: 2,
    category: "イベント",
    division: "LINE広告",
    area: "関東②",
    department: "営業部",
  },
  {
    id: "3",
    code: "PJ-003",
    name: "エスパス日拓高田馬場 - 山田 太郎",
    status: "pending",
    detailStatus: "proposing",
    companyName: "日拓グループ",
    companyId: "CORP-003",
    hallName: "エスパス日拓高田馬場",
    hallId: "CORP-003-HALL-08",
    salesRep: "山田 太郎",
    date: "2026-01-20",
    location: "東京都新宿区",
    budget: 720000,
    createdAt: "2026-02-08",
    materialCount: 1,
    category: "イベント",
    division: "トリニティガール",
    area: "関東③",
    department: "管理部",
  },
  {
    id: "4",
    code: "PJ-004",
    name: "BEAM店 - 高橋四郎",
    status: "completed",
    detailStatus: "completed",
    companyName: "株式会社エース",
    companyId: "CORP-004",
    hallName: "BEAM店",
    hallId: "CORP-004-HALL-04",
    salesRep: "高橋 四郎",
    date: "2026-03-17",
    location: "東京都",
    budget: 33000,
    createdAt: "2026-03-12",
    materialCount: 1,
    category: "イベント",
    division: "LINE広告",
    area: "大手法人",
    department: "経理部",
  },
]

// サンプルレコードデータ
export const sampleRecords: RecordData[] = [
  {
    id: "r1",
    recordNumber: "13829",
    recordTitle: "レコードNo.13829",
    projectId: "1",
    projectNumber: "PJ-001",
    status: "office_applying",
    statusLabel: "[事務] 申請中",
    orderDate: "",
    storeCode: "P02288",
    storeName: "JOY PARK店",
    publicationStartDate: "2026-03-21",
    publicationEndDate: "2026-03-23",
    publicationDays: 3,
    netAmount: 50000,
    dailyBudget: 16667,
    deliveryArea: "川越市",
    target: "この地域に住んでいる人",
    materialCategory: "イベント",
    materialName: "LINE広告",
    campaignObjective: "ウェブサイトアクセス",
    billingMethod: "CPC",
  },
  {
    id: "r2",
    recordNumber: "13828",
    recordTitle: "レコードNo.13828",
    projectId: "2",
    projectNumber: "PJ-002",
    status: "office_approved",
    statusLabel: "[事務] 事務承認",
    orderDate: "",
    storeCode: "P02284",
    storeName: "パチンコ店",
    publicationStartDate: "2026-03-19",
    publicationEndDate: "2026-03-21",
    publicationDays: 3,
    netAmount: 21000,
    dailyBudget: 7000,
    deliveryArea: "長崎県長崎市",
    target: "この地域に住んでいる人",
    materialCategory: "イベント",
    materialName: "LINE広告",
    campaignObjective: "ウェブサイトアクセス",
    billingMethod: "CPC",
  },
  {
    id: "r3",
    recordNumber: "13827",
    recordTitle: "レコードNo.13827",
    projectId: "3",
    projectNumber: "PJ-003",
    status: "agency_pending",
    statusLabel: "[代理店様] 受領待ち",
    orderDate: "2026-03-15",
    storeCode: "P06498",
    storeName: "グランパ店",
    publicationStartDate: "2026-03-25",
    publicationEndDate: "2026-03-29",
    publicationDays: 5,
    netAmount: 25000,
    dailyBudget: 5000,
    deliveryArea: "東京都新宿区",
    target: "この地域に住んでいる人",
    materialCategory: "イベント",
    materialName: "LINE広告",
    campaignObjective: "ウェブサイトアクセス",
    billingMethod: "CPC",
  },
  {
    id: "r4",
    recordNumber: "13826",
    recordTitle: "レコードNo.13826",
    projectId: "4",
    projectNumber: "PJ-004",
    status: "agency_reviewing",
    statusLabel: "[代理店様] 審査中",
    orderDate: "2026-03-14",
    storeCode: "P03150",
    storeName: "BEAM店",
    publicationStartDate: "2026-03-20",
    publicationEndDate: "2026-03-22",
    publicationDays: 3,
    netAmount: 33000,
    dailyBudget: 11000,
    deliveryArea: "東京都",
    target: "この地域に住んでいる人",
    materialCategory: "イベント",
    materialName: "LINE広告",
    campaignObjective: "ウェブサイトアクセス",
    billingMethod: "CPC",
  },
  {
    id: "r5",
    recordNumber: "13825",
    recordTitle: "レコードNo.13825",
    projectId: "1",
    projectNumber: "PJ-001",
    status: "in_progress",
    statusLabel: "進行中",
    orderDate: "2026-03-10",
    storeCode: "P02288",
    storeName: "JOY PARK店",
    publicationStartDate: "2026-03-15",
    publicationEndDate: "2026-03-18",
    publicationDays: 4,
    netAmount: 40000,
    dailyBudget: 10000,
    deliveryArea: "川越市",
    target: "この地域に住んでいる人",
    materialCategory: "オプション",
    materialName: "トリニティガール",
    campaignObjective: "ウェブサイトアクセス",
    billingMethod: "CPM",
  },
  {
    id: "r6",
    recordNumber: "13824",
    recordTitle: "レコードNo.13824",
    projectId: "2",
    projectNumber: "PJ-002",
    status: "completed",
    statusLabel: "完了",
    orderDate: "2026-03-01",
    storeCode: "P02284",
    storeName: "パチンコ店",
    publicationStartDate: "2026-03-05",
    publicationEndDate: "2026-03-10",
    publicationDays: 6,
    netAmount: 60000,
    dailyBudget: 10000,
    deliveryArea: "長崎県長崎市",
    target: "この地域に住んでいる人",
    materialCategory: "イベント",
    materialName: "LINE広告",
    campaignObjective: "友だち追加",
    billingMethod: "CPF",
  },
]

const statusOptions = [
  { value: "pre_proposal", label: "提案前" },
  { value: "office_applying", label: "[事務] 申請中" },
  { value: "office_approved", label: "[事務] 事務承認" },
  { value: "agency_pending", label: "[代理店様] 受領待ち" },
  { value: "agency_reviewing", label: "[代理店様] 審査中" },
  { value: "in_progress", label: "進行中" },
  { value: "completed", label: "完了" },
]

const SEARCH_CONDITIONS_KEY = "savedSearchConditions"

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "pre_proposal": return "bg-orange-100 text-orange-800 border-orange-200"
    case "office_applying": return "bg-blue-100 text-blue-800 border-blue-200"
    case "office_approved": return "bg-teal-100 text-teal-800 border-teal-200"
    case "agency_pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "agency_reviewing": return "bg-purple-100 text-purple-800 border-purple-200"
    case "in_progress": return "bg-green-100 text-green-800 border-green-200"
    case "completed": return "bg-gray-100 text-gray-800 border-gray-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getStatusDotClass(status: string): string {
  switch (status) {
    case "pre_proposal": return "bg-orange-500"
    case "office_applying": return "bg-blue-500"
    case "office_approved": return "bg-teal-500"
    case "agency_pending": return "bg-yellow-500"
    case "agency_reviewing": return "bg-purple-500"
    case "in_progress": return "bg-green-500"
    case "completed": return "bg-gray-500"
    default: return "bg-gray-500"
  }
}

export function ProjectList({ onSelectProject, onSelectRecord, onCreateProject, onAddMaterial, projects, records, onDuplicateRecords }: ProjectListProps) {
  const [activeTab, setActiveTab] = useState<"list" | "messages">("list")
  const [filterCompany, setFilterCompany] = useState<CompanyData | null>(null)
  const [filterHall, setFilterHall] = useState<HallData | null>(null)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [hallOpen, setHallOpen] = useState(false)
  const [companyQuery, setCompanyQuery] = useState("")
  const [hallQuery, setHallQuery] = useState("")
  const [filterDepartmentArea, setFilterDepartmentArea] = useState("")
  const [departmentAreaOpen, setDepartmentAreaOpen] = useState(false)
  const [departmentAreaQuery, setDepartmentAreaQuery] = useState("")
  const [filterStatuses, setFilterStatuses] = useState<string[]>([])
  const [filterMaterialCategory, setFilterMaterialCategory] = useState("")
  const [materialCategoryOpen, setMaterialCategoryOpen] = useState(false)
  const [materialCategoryQuery, setMaterialCategoryQuery] = useState("")
  const [filterMaterialName, setFilterMaterialName] = useState("")
  const [materialNameOpen, setMaterialNameOpen] = useState(false)
  const [materialNameQuery, setMaterialNameQuery] = useState("")
  const [filterProjectNumber, setFilterProjectNumber] = useState("")
  const [filterProjectCode, setFilterProjectCode] = useState("")
  const [filterRecordNumber, setFilterRecordNumber] = useState("")
  const [filterProjectName, setFilterProjectName] = useState("")
  const [filterSalesRep, setFilterSalesRep] = useState("")
  const [salesRepOpen, setSalesRepOpen] = useState(false)
  const [salesRepQuery, setSalesRepQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(true)

  // 検索条件保存
  const [savedConditions, setSavedConditions] = useState<SavedSearchCondition[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SEARCH_CONDITIONS_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveConditionName, setSaveConditionName] = useState("")
  const [conditionsListOpen, setConditionsListOpen] = useState(false)
  const [editingConditionId, setEditingConditionId] = useState<string | null>(null)
  const [editConditionName, setEditConditionName] = useState("")
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false)
  const [duplicateProjectId, setDuplicateProjectId] = useState<string | null>(null)
  const [selectedRecordsForDuplicate, setSelectedRecordsForDuplicate] = useState<string[]>([])
  const duplicateProjectRecords = duplicateProjectId ? records.filter(r => r.projectId === duplicateProjectId) : []

  const filteredCompanies = useMemo(
    () => searchCompanies(initialCompanies, companyQuery),
    [companyQuery]
  )
  const filteredHalls = useMemo(
    () => searchHalls(initialHalls, hallQuery, filterCompany?.id),
    [hallQuery, filterCompany?.id]
  )

  const DEPARTMENT_AREA_OPTIONS = useMemo(() => [...DEPARTMENT_OPTIONS, ...AREA_OPTIONS], [])
  const filteredDepartmentAreas = useMemo(() => {
    if (!departmentAreaQuery) return DEPARTMENT_AREA_OPTIONS
    return DEPARTMENT_AREA_OPTIONS.filter(n => n.includes(departmentAreaQuery))
  }, [departmentAreaQuery, DEPARTMENT_AREA_OPTIONS])

  const filteredSalesReps = useMemo(() => {
    if (!salesRepQuery) return initialEmployees
    return initialEmployees.filter(e => e.name.includes(salesRepQuery))
  }, [salesRepQuery])

  const filteredMaterialCategories = useMemo(() => {
    if (!materialCategoryQuery) return MATERIAL_CATEGORY_OPTIONS
    return MATERIAL_CATEGORY_OPTIONS.filter(n => n.includes(materialCategoryQuery))
  }, [materialCategoryQuery])

  const filteredMaterialNames = useMemo(() => {
    if (!materialNameQuery) return MATERIAL_NAME_OPTIONS
    return MATERIAL_NAME_OPTIONS.filter(n => n.includes(materialNameQuery))
  }, [materialNameQuery])

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const project = projects.find(p => p.id === record.projectId)
      if (filterDepartmentArea) {
        if (project) {
          const isDept = DEPARTMENT_OPTIONS.includes(filterDepartmentArea)
          if (isDept && project.department !== filterDepartmentArea) return false
          if (!isDept && project.area !== filterDepartmentArea) return false
        }
      }
      if (filterStatuses.length > 0 && !filterStatuses.includes(record.status)) return false
      if (filterMaterialCategory && record.materialCategory !== filterMaterialCategory) return false
      if (filterMaterialName && record.materialName !== filterMaterialName) return false
      if (filterProjectCode && !record.projectNumber.includes(filterProjectCode)) return false
      if (filterProjectNumber) {
        if (project && !project.code.includes(filterProjectNumber)) return false
      }
      if (filterRecordNumber && !record.recordNumber.includes(filterRecordNumber)) return false
      if (filterProjectName) {
        if (project && !project.name.includes(filterProjectName)) return false
      }
      if (filterSalesRep) {
        if (project && !project.salesRep.includes(filterSalesRep)) return false
      }
      if (filterCompany) {
        if (project && project.companyId !== filterCompany.companyId) return false
      }
      if (filterHall) {
        if (project && project.hallId !== filterHall.hallId) return false
      }
      return true
    })
  }, [records, projects, filterDepartmentArea, filterStatuses, filterMaterialCategory, filterMaterialName, filterProjectCode, filterProjectNumber, filterRecordNumber, filterProjectName, filterSalesRep, filterCompany, filterHall])

  const toggleStatus = (status: string) => {
    setFilterStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const clearAllFilters = () => {
    setFilterCompany(null)
    setFilterHall(null)
    setFilterDepartmentArea("")
    setFilterStatuses([])
    setFilterMaterialCategory("")
    setFilterMaterialName("")
    setFilterProjectNumber("")
    setFilterProjectCode("")
    setFilterRecordNumber("")
    setFilterProjectName("")
    setFilterSalesRep("")
  }

  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string; value: string }[] = []
    if (filterCompany) filters.push({ key: "company", label: "法人", value: filterCompany.name })
    if (filterHall) filters.push({ key: "hall", label: "ホール", value: filterHall.name })
    if (filterDepartmentArea) filters.push({ key: "departmentArea", label: "部やエリア", value: filterDepartmentArea })
    if (filterStatuses.length > 0) filters.push({ key: "statuses", label: "ステータス", value: filterStatuses.map(s => statusOptions.find(o => o.value === s)?.label || s).join(", ") })
    if (filterMaterialCategory) filters.push({ key: "materialCategory", label: "商材区分", value: filterMaterialCategory })
    if (filterMaterialName) filters.push({ key: "materialName", label: "商材名", value: filterMaterialName })
    if (filterSalesRep) filters.push({ key: "salesRep", label: "ホール担当", value: filterSalesRep })
    if (filterProjectCode) filters.push({ key: "projectCode", label: "案件No", value: filterProjectCode })
    if (filterProjectNumber) filters.push({ key: "projectNumber", label: "案件番号", value: filterProjectNumber })
    if (filterRecordNumber) filters.push({ key: "recordNumber", label: "レコード番号", value: filterRecordNumber })
    if (filterProjectName) filters.push({ key: "projectName", label: "案件名", value: filterProjectName })
    return filters
  }, [filterCompany, filterHall, filterDepartmentArea, filterStatuses, filterMaterialCategory, filterMaterialName, filterSalesRep, filterProjectCode, filterProjectNumber, filterRecordNumber, filterProjectName])

  const removeFilter = (key: string) => {
    switch (key) {
      case "company": setFilterCompany(null); break
      case "hall": setFilterHall(null); break
      case "departmentArea": setFilterDepartmentArea(""); break
      case "statuses": setFilterStatuses([]); break
      case "materialCategory": setFilterMaterialCategory(""); break
      case "materialName": setFilterMaterialName(""); break
      case "salesRep": setFilterSalesRep(""); break
      case "projectCode": setFilterProjectCode(""); break
      case "projectNumber": setFilterProjectNumber(""); break
      case "recordNumber": setFilterRecordNumber(""); break
      case "projectName": setFilterProjectName(""); break
    }
  }

  const handleSaveCondition = () => {
    if (!saveConditionName.trim()) return
    const newCondition: SavedSearchCondition = {
      id: String(Date.now()),
      name: saveConditionName,
      conditions: {
        company: filterCompany ? JSON.stringify({ id: filterCompany.id, companyId: filterCompany.companyId, name: filterCompany.name }) : undefined,
        hall: filterHall ? JSON.stringify({ id: filterHall.id, hallId: filterHall.hallId, name: filterHall.name, salesPersonName: filterHall.salesPersonName, companyId: filterHall.companyId, discountAmount: filterHall.discountAmount }) : undefined,
        departmentArea: filterDepartmentArea || undefined,
        materialCategory: filterMaterialCategory || undefined,
        materialName: filterMaterialName || undefined,
        statuses: filterStatuses.length > 0 ? filterStatuses : undefined,
        projectNumber: filterProjectNumber || undefined,
        projectCode: filterProjectCode || undefined,
        recordNumber: filterRecordNumber || undefined,
        projectName: filterProjectName || undefined,
        salesRep: filterSalesRep || undefined,
      },
      createdAt: new Date().toISOString().split("T")[0],
    }
    const updated = [...savedConditions, newCondition]
    setSavedConditions(updated)
    localStorage.setItem(SEARCH_CONDITIONS_KEY, JSON.stringify(updated))
    setSaveConditionName("")
    setSaveDialogOpen(false)
  }

  const handleDeleteCondition = (id: string) => {
    const updated = savedConditions.filter(c => c.id !== id)
    setSavedConditions(updated)
    localStorage.setItem(SEARCH_CONDITIONS_KEY, JSON.stringify(updated))
  }

  const handleLoadCondition = (condition: SavedSearchCondition) => {
    const c = condition.conditions
    if (c.company) {
      try { setFilterCompany(JSON.parse(c.company)) } catch { setFilterCompany(null) }
    } else { setFilterCompany(null) }
    if (c.hall) {
      try { setFilterHall(JSON.parse(c.hall)) } catch { setFilterHall(null) }
    } else { setFilterHall(null) }
    setFilterDepartmentArea(c.departmentArea || c.department || c.area || "")
    setFilterMaterialCategory(c.materialCategory || "")
    setFilterMaterialName(c.materialName || "")
    setFilterStatuses(c.statuses || [])
    setFilterProjectNumber(c.projectNumber || "")
    setFilterProjectCode(c.projectCode || "")
    setFilterRecordNumber(c.recordNumber || "")
    setFilterProjectName(c.projectName || "")
    setFilterSalesRep(c.salesRep || "")
    setConditionsListOpen(false)
  }

  const handleEditCondition = (condition: SavedSearchCondition) => {
    setEditingConditionId(condition.id)
    setEditConditionName(condition.name)
  }

  const handleSaveEditCondition = () => {
    if (!editingConditionId || !editConditionName.trim()) return
    const updated = savedConditions.map(c =>
      c.id === editingConditionId
        ? {
            ...c,
            name: editConditionName,
            conditions: {
              company: filterCompany ? JSON.stringify({ id: filterCompany.id, companyId: filterCompany.companyId, name: filterCompany.name }) : undefined,
              hall: filterHall ? JSON.stringify({ id: filterHall.id, hallId: filterHall.hallId, name: filterHall.name, salesPersonName: filterHall.salesPersonName, companyId: filterHall.companyId, discountAmount: filterHall.discountAmount }) : undefined,
              departmentArea: filterDepartmentArea || undefined,
              materialCategory: filterMaterialCategory || undefined,
              materialName: filterMaterialName || undefined,
              statuses: filterStatuses.length > 0 ? filterStatuses : undefined,
              projectNumber: filterProjectNumber || undefined,
              projectCode: filterProjectCode || undefined,
              recordNumber: filterRecordNumber || undefined,
              projectName: filterProjectName || undefined,
              salesRep: filterSalesRep || undefined,
            },
          }
        : c
    )
    setSavedConditions(updated)
    localStorage.setItem(SEARCH_CONDITIONS_KEY, JSON.stringify(updated))
    setEditingConditionId(null)
    setEditConditionName("")
  }

  const handleExportAllConditions = () => {
    const json = JSON.stringify(savedConditions, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `検索条件一覧_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOpenDuplicateModal = (e: React.MouseEvent, record: RecordData) => {
    e.stopPropagation()
    setDuplicateProjectId(record.projectId)
    setSelectedRecordsForDuplicate([record.id])
    setDuplicateModalOpen(true)
  }

  const toggleRecordForDuplicate = (recordId: string) => {
    setSelectedRecordsForDuplicate(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  const handleDuplicate = () => {
    if (!onDuplicateRecords || selectedRecordsForDuplicate.length === 0 || !duplicateProjectId) return
    const recordsToDuplicate = records
      .filter(r => selectedRecordsForDuplicate.includes(r.id))
      .map(r => ({
        ...r,
        id: `r-dup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        recordNumber: String(13800 + records.length + Math.floor(Math.random() * 100)),
        recordTitle: `レコードNo.${13800 + records.length}…`,
        status: "pre_proposal" as const,
        statusLabel: "提案前",
        orderDate: "",
      }))
    onDuplicateRecords(recordsToDuplicate, duplicateProjectId)
    setDuplicateModalOpen(false)
    setDuplicateProjectId(null)
    setSelectedRecordsForDuplicate([])
  }

  const handleExportRecords = () => {
    const headers = ["ステータス", "レコードタイトル", "発注日", "レコード番号", "店舗コード", "店舗名", "掲載開始希望日", "掲載終了日", "掲載日数", "実NET額", "日予算", "キャンペーン目的", "課金方式"]
    const rows = filteredRecords.map(r => [
      r.statusLabel, r.recordTitle, r.orderDate, r.recordNumber,
      r.storeCode, r.storeName, r.publicationStartDate, r.publicationEndDate,
      String(r.publicationDays), `¥${r.netAmount.toLocaleString()}`, `¥${r.dailyBudget.toLocaleString()}`,
      r.campaignObjective || "", r.billingMethod || ""
    ])
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `レコード一覧_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-base font-bold text-primary-foreground">J</span>
            </div>
            <span className="text-base font-bold text-foreground">DMM</span>
            <span className="text-sm text-muted-foreground">Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <RefreshCw className="h-4 w-4" />
              デモ初期化
            </Button>
            <Badge className="bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium rounded-md">
              営業
            </Badge>
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <ArrowRightLeft className="h-4 w-4" />
              ロールを変更
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content (no sidebar) */}
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        {/* タイトル + ボタン */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">レコード一覧</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onAddMaterial}>
              <Plus className="mr-2 h-4 w-4" />
              新規商材追加
            </Button>
            <Button onClick={() => onCreateProject({ company: filterCompany, hall: filterHall })}>
              <Plus className="mr-2 h-4 w-4" />
              新規案件作成
            </Button>
          </div>
        </div>

        {/* タブ */}
        <div className="flex items-center gap-6 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("list")}
            className={cn(
              "pb-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "list"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            レコード一覧
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={cn(
              "pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
              activeTab === "messages"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            新着メッセージ
            <Badge className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0 min-w-[20px] h-5 rounded-full">
              5
            </Badge>
          </button>
        </div>

        {activeTab === "list" && (
          <>
            {/* 検索カード */}
            <Card className="mb-8 shadow-sm">
              <CardContent className="p-6">
                {/* ヘッダー: タイトル + 操作ボタン */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span className="text-base font-bold">案件検索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setConditionsListOpen(true)} className="gap-1.5">
                      <ChevronDown className="h-3.5 w-3.5" />
                      保存済み条件 ({savedConditions.length})
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSaveDialogOpen(true)} className="gap-1.5">
                      <Save className="h-3.5 w-3.5" />
                      条件を保存
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportRecords} className="gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      エクスポート
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">複数の条件で案件を絞り込むことができます</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                  {/* 法人 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">法人</Label>
                    <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between font-normal", !filterCompany && "text-muted-foreground")}
                        >
                          {filterCompany ? filterCompany.name : "法人を検索..."}
                          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="法人名・コードで検索..." value={companyQuery} onValueChange={setCompanyQuery} />
                          <CommandList>
                            <CommandEmpty>該当する法人が見つかりません</CommandEmpty>
                            <CommandGroup>
                              {filteredCompanies.map((c) => (
                                <CommandItem
                                  key={c.id}
                                  value={String(c.id)}
                                  onSelect={() => {
                                    setFilterCompany(filterCompany?.id === c.id ? null : c)
                                    if (filterCompany?.id !== c.id) setFilterHall(null)
                                    setCompanyQuery("")
                                    setCompanyOpen(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", filterCompany?.id === c.id ? "opacity-100" : "opacity-0")} />
                                  <div className="flex flex-col">
                                    <span className="text-sm">{c.name}</span>
                                    <span className="text-xs text-muted-foreground">{c.companyId}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* ホール */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">ホール</Label>
                    <Popover open={hallOpen} onOpenChange={setHallOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between font-normal", !filterHall && "text-muted-foreground")}
                        >
                          {filterHall ? filterHall.name : "ホールを検索..."}
                          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="ホール名で検索..." value={hallQuery} onValueChange={setHallQuery} />
                          <CommandList>
                            <CommandEmpty>該当するホールが見つかりません</CommandEmpty>
                            <CommandGroup>
                              {filteredHalls.slice(0, 20).map((h) => (
                                <CommandItem
                                  key={h.id}
                                  value={String(h.id)}
                                  onSelect={() => {
                                    setFilterHall(filterHall?.id === h.id ? null : h)
                                    setHallQuery("")
                                    setHallOpen(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", filterHall?.id === h.id ? "opacity-100" : "opacity-0")} />
                                  <div className="flex flex-col">
                                    <span className="text-sm">{h.name}</span>
                                    <span className="text-xs text-muted-foreground">{h.hallId}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* 部やエリア */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">部やエリア</Label>
                    <Popover open={departmentAreaOpen} onOpenChange={setDepartmentAreaOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between font-normal", !filterDepartmentArea && "text-muted-foreground")}
                        >
                          {filterDepartmentArea || "エリアを選択..."}
                          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="部・エリアで検索..." value={departmentAreaQuery} onValueChange={setDepartmentAreaQuery} />
                          <CommandList>
                            <CommandEmpty>該当する部・エリアが見つかりません</CommandEmpty>
                            <CommandGroup>
                              {filteredDepartmentAreas.map((item) => (
                                <CommandItem
                                  key={item}
                                  value={item}
                                  onSelect={() => {
                                    setFilterDepartmentArea(filterDepartmentArea === item ? "" : item)
                                    setDepartmentAreaQuery("")
                                    setDepartmentAreaOpen(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", filterDepartmentArea === item ? "opacity-100" : "opacity-0")} />
                                  <span className="text-sm">{item}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* ステータス */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">ステータス</Label>
                    <Select
                      value={filterStatuses.length === 1 ? filterStatuses[0] : ""}
                      onValueChange={(val) => setFilterStatuses(val ? [val] : [])}
                    >
                      <SelectTrigger className={cn("w-full", filterStatuses.length === 0 && "text-muted-foreground")}>
                        <SelectValue placeholder="ステータスを選択..." />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 商材区分 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">商材区分</Label>
                    <Popover open={materialCategoryOpen} onOpenChange={setMaterialCategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between font-normal", !filterMaterialCategory && "text-muted-foreground")}
                        >
                          {filterMaterialCategory || "商材区分を検索..."}
                          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="商材区分で検索..." value={materialCategoryQuery} onValueChange={setMaterialCategoryQuery} />
                          <CommandList>
                            <CommandEmpty>該当する商材区分が見つかりません</CommandEmpty>
                            <CommandGroup>
                              {filteredMaterialCategories.map((cat) => (
                                <CommandItem
                                  key={cat}
                                  value={cat}
                                  onSelect={() => {
                                    setFilterMaterialCategory(filterMaterialCategory === cat ? "" : cat)
                                    setMaterialCategoryQuery("")
                                    setMaterialCategoryOpen(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", filterMaterialCategory === cat ? "opacity-100" : "opacity-0")} />
                                  <span className="text-sm">{cat}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* 商材名 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">商材名</Label>
                    <Popover open={materialNameOpen} onOpenChange={setMaterialNameOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between font-normal", !filterMaterialName && "text-muted-foreground")}
                        >
                          {filterMaterialName || "商材名を検索..."}
                          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="商材名で検索..." value={materialNameQuery} onValueChange={setMaterialNameQuery} />
                          <CommandList>
                            <CommandEmpty>該当する商材が見つかりません</CommandEmpty>
                            <CommandGroup>
                              {filteredMaterialNames.map((name) => (
                                <CommandItem
                                  key={name}
                                  value={name}
                                  onSelect={() => {
                                    setFilterMaterialName(filterMaterialName === name ? "" : name)
                                    setMaterialNameQuery("")
                                    setMaterialNameOpen(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", filterMaterialName === name ? "opacity-100" : "opacity-0")} />
                                  <span className="text-sm">{name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* 期間 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">期間</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input type="date" className="text-xs" />
                      </div>
                      <span className="text-muted-foreground text-sm">-</span>
                      <div className="relative flex-1">
                        <Input type="date" className="text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* ホール担当 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">ホール担当</Label>
                    <Popover open={salesRepOpen} onOpenChange={setSalesRepOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between font-normal", !filterSalesRep && "text-muted-foreground")}
                        >
                          {filterSalesRep || "ホール担当を選択..."}
                          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="担当者名で検索..." value={salesRepQuery} onValueChange={setSalesRepQuery} />
                          <CommandList>
                            <CommandEmpty>該当する担当者が見つかりません</CommandEmpty>
                            <CommandGroup>
                              {filteredSalesReps.slice(0, 20).map((emp) => (
                                <CommandItem
                                  key={emp.id}
                                  value={String(emp.id)}
                                  onSelect={() => {
                                    setFilterSalesRep(filterSalesRep === emp.name ? "" : emp.name)
                                    setSalesRepQuery("")
                                    setSalesRepOpen(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", filterSalesRep === emp.name ? "opacity-100" : "opacity-0")} />
                                  <span className="text-sm">{emp.name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* 案件No */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">案件No</Label>
                    <Input
                      placeholder="案件Noを入力..."
                      value={filterProjectCode}
                      onChange={(e) => setFilterProjectCode(e.target.value)}
                    />
                  </div>

                  {/* 案件番号 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">案件番号</Label>
                    <Input
                      placeholder="案件番号を入力..."
                      value={filterProjectNumber}
                      onChange={(e) => setFilterProjectNumber(e.target.value)}
                    />
                  </div>

                  {/* レコード番号 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">レコード番号</Label>
                    <Input
                      placeholder="レコード番号を入力..."
                      value={filterRecordNumber}
                      onChange={(e) => setFilterRecordNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* 案件名（フル幅） */}
                <div className="mt-5 space-y-2">
                  <Label className="text-sm font-bold">案件名</Label>
                  <Input
                    placeholder="案件名を入力..."
                    value={filterProjectName}
                    onChange={(e) => setFilterProjectName(e.target.value)}
                  />
                </div>

                {/* アクティブフィルタータグ */}
                {activeFilters.length > 0 && (
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">検索条件:</span>
                      {activeFilters.map((filter) => (
                        <span
                          key={filter.key}
                          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-sm"
                        >
                          {filter.label}: {filter.value}
                          <button
                            type="button"
                            onClick={() => removeFilter(filter.key)}
                            className="ml-0.5 hover:text-foreground text-muted-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      すべてクリア
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* レコード一覧テーブル */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">案件番号</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap w-8"></th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">ステータス</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">レコードタイトル</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">発注日</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">レコード番号</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">店舗コード</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">店舗名</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">掲載開始希望日</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">掲載終了日</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">掲載日数</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">実NET額</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">日予算</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">キャンペーン目的</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">課金方式</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground whitespace-nowrap w-10">複製</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => onSelectRecord(record.id)}
                      >
                        <td className="px-4 py-3">
                          <button
                            className="text-primary hover:underline font-medium text-sm"
                            onClick={(e) => { e.stopPropagation(); onSelectProject(record.projectId) }}
                          >
                            {record.projectNumber}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className={cn("h-3 w-3 rounded-sm", getStatusDotClass(record.status))} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.statusLabel}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-sm">{record.recordTitle}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.orderDate || ""}</td>
                        <td className="px-4 py-3">
                          <button
                            className="text-primary hover:underline font-medium text-sm"
                            onClick={(e) => { e.stopPropagation(); onSelectRecord(record.id) }}
                          >
                            {record.recordNumber}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-primary text-sm">{record.storeCode}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {record.storeName.length > 5 ? record.storeName.slice(0, 5) + "…" : record.storeName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.publicationStartDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.publicationEndDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.publicationDays}日間</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">¥{record.netAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">¥{record.dailyBudget.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.campaignObjective || "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.billingMethod || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={(e) => handleOpenDuplicateModal(e, record)}
                            className="inline-flex items-center justify-center h-7 w-7 rounded hover:bg-gray-100 transition-colors text-muted-foreground hover:text-foreground"
                            title="複製"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRecords.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    該当するレコードがありません
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "messages" && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">新着メッセージはありません</p>
          </div>
        )}
      </main>

      {/* 検索条件保存ダイアログ */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>検索条件を保存</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>条件名</Label>
              <Input
                value={saveConditionName}
                onChange={(e) => setSaveConditionName(e.target.value)}
                placeholder="例: よく使う検索条件"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>キャンセル</Button>
            <Button onClick={handleSaveCondition} disabled={!saveConditionName.trim()}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 保存された検索条件一覧ダイアログ */}
      <Dialog open={conditionsListOpen} onOpenChange={(open) => { setConditionsListOpen(open); if (!open) setEditingConditionId(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>保存された検索条件</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-[400px] overflow-y-auto">
            {savedConditions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">保存された条件はありません</p>
            ) : (
              savedConditions.map((condition) => (
                <div key={condition.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30">
                  {editingConditionId === condition.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <Input
                        value={editConditionName}
                        onChange={(e) => setEditConditionName(e.target.value)}
                        className="h-8 text-sm"
                      />
                      <Button size="sm" onClick={handleSaveEditCondition} disabled={!editConditionName.trim()}>
                        保存
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingConditionId(null)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="text-sm font-medium">{condition.name}</div>
                        <div className="text-xs text-muted-foreground">{condition.createdAt}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleLoadCondition(condition)}>
                          適用
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditCondition(condition)} title="編集">
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          const json = JSON.stringify(condition, null, 2)
                          const blob = new Blob([json], { type: "application/json" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `検索条件_${condition.name}.json`
                          a.click()
                          URL.revokeObjectURL(url)
                        }}>
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCondition(condition.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
          {savedConditions.length > 0 && (
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={handleExportAllConditions} className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                条件一覧をエクスポート
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* 複製モーダル */}
      <Dialog open={duplicateModalOpen} onOpenChange={(open) => { setDuplicateModalOpen(open); if (!open) { setDuplicateProjectId(null); setSelectedRecordsForDuplicate([]) } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>レコードを複製</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              この案件に含まれるレコードから、複製するものを選択してください。
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {duplicateProjectRecords.map((record) => (
                <label
                  key={record.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedRecordsForDuplicate.includes(record.id)}
                    onCheckedChange={() => toggleRecordForDuplicate(record.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">レコード {record.recordNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {record.materialName} | {record.storeName} | ¥{record.netAmount.toLocaleString()}
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-xs shrink-0", getStatusBadgeClass(record.status))}>
                    {record.statusLabel}
                  </Badge>
                </label>
              ))}
              {duplicateProjectRecords.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">レコードがありません</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateModalOpen(false)}>キャンセル</Button>
            <Button
              onClick={handleDuplicate}
              disabled={selectedRecordsForDuplicate.length === 0}
            >
              <Copy className="mr-2 h-4 w-4" />
              複製（{selectedRecordsForDuplicate.length}件）
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
