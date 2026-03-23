"use client"

import { useState } from "react"
import { ProjectList, sampleProjects, sampleRecords } from "@/components/projects/project-list"
import { ProjectDetail } from "@/components/projects/project-detail"
import { ProjectForm } from "@/components/projects/project-form"
import { RecordDetail } from "@/components/projects/record-detail"
import { AddMaterialModal } from "@/components/projects/add-material-modal"
import type { Project, ProjectStatus, RecordData } from "@/types/workflow"

type ViewMode = "list" | "detail" | "create" | "record_detail"

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [records, setRecords] = useState<RecordData[]>(sampleRecords)
  const [addMaterialOpen, setAddMaterialOpen] = useState(false)
  const [addMaterialProjectId, setAddMaterialProjectId] = useState<string | undefined>()

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    setViewMode("detail")
  }

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId)
    setViewMode("record_detail")
  }

  const handleCreateProject = (newProject: Project, newRecords: RecordData[]) => {
    setProjects((prev) => [newProject, ...prev])
    if (newRecords.length > 0) {
      setRecords((prev) => [...newRecords, ...prev])
    }
    setViewMode("list")
  }

  const handleBack = () => {
    setSelectedProjectId(null)
    setSelectedRecordId(null)
    setViewMode("list")
  }

  const handleBackFromRecord = () => {
    setSelectedRecordId(null)
    if (selectedProjectId) {
      setViewMode("detail")
    } else {
      setViewMode("list")
    }
  }

  const handleStatusChange = (status: ProjectStatus) => {
    if (!selectedProjectId) return
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProjectId ? { ...p, status } : p
      )
    )
  }

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    )
  }

  const handleAddMaterial = (projectId: string, material: Partial<RecordData>) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    const newRecordId = `r-${Date.now()}`
    const newRecord: RecordData = {
      id: newRecordId,
      recordNumber: String(13800 + records.length + 1),
      recordTitle: `レコードNo.${13800 + records.length + 1}`,
      projectId: projectId,
      projectNumber: project.code,
      status: "office_applying",
      statusLabel: "[事務] 申請中",
      orderDate: new Date().toISOString().split("T")[0],
      storeCode: material.storeCode || "",
      storeName: material.storeName || project.hallName || "",
      publicationStartDate: material.publicationStartDate || "",
      publicationEndDate: material.publicationEndDate || "",
      publicationDays: material.publicationDays || 1,
      netAmount: material.netAmount || 0,
      dailyBudget: material.dailyBudget || 0,
      deliveryArea: material.deliveryArea || "",
      target: material.target || "この地域に住んでいる人",
      materialCategory: material.materialCategory || "イベント",
      materialName: material.materialName || "LINE広告",
      campaignObjective: material.campaignObjective || "ウェブサイトアクセス",
      billingMethod: material.billingMethod || "CPC",
    }

    setRecords(prev => [newRecord, ...prev])

    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, materialCount: records.filter(r => r.projectId === projectId).length + 1 }
          : p
      )
    )

    // 商材追加後に商材詳細画面に遷移
    setSelectedRecordId(newRecordId)
    setViewMode("record_detail")
  }

  const handleOpenAddMaterial = () => {
    setAddMaterialProjectId(undefined)
    setAddMaterialOpen(true)
  }

  const handleOpenAddMaterialToProject = (projectId: string) => {
    setAddMaterialProjectId(projectId)
    setAddMaterialOpen(true)
  }

  if (viewMode === "record_detail" && selectedRecordId) {
    const selectedRecord = records.find(r => r.id === selectedRecordId)
    const parentProject = selectedRecord ? projects.find(p => p.id === selectedRecord.projectId) : undefined
    if (selectedRecord) {
      return (
        <RecordDetail
          record={selectedRecord}
          project={parentProject}
          onBack={handleBackFromRecord}
        />
      )
    }
  }

  if (viewMode === "detail" && selectedProjectId) {
    const selectedProject = projects.find(p => p.id === selectedProjectId)
    return (
      <>
        <ProjectDetail
          projectId={selectedProjectId}
          project={selectedProject}
          records={records}
          onBack={handleBack}
          onStatusChange={handleStatusChange}
          onProjectUpdate={handleProjectUpdate}
          onSelectRecord={(recordId) => {
            setSelectedRecordId(recordId)
            setViewMode("record_detail")
          }}
          onAddMaterialToProject={handleOpenAddMaterialToProject}
        />
        <AddMaterialModal
          open={addMaterialOpen}
          onOpenChange={setAddMaterialOpen}
          projects={projects}
          records={records}
          onAddMaterial={handleAddMaterial}
          preselectedProjectId={addMaterialProjectId}
        />
      </>
    )
  }

  if (viewMode === "create") {
    return <ProjectForm onBack={handleBack} onSubmit={handleCreateProject} />
  }

  return (
    <>
      <ProjectList
        onSelectProject={handleSelectProject}
        onSelectRecord={handleSelectRecord}
        onCreateProject={() => setViewMode("create")}
        onAddMaterial={handleOpenAddMaterial}
        projects={projects}
        records={records}
      />
      <AddMaterialModal
        open={addMaterialOpen}
        onOpenChange={setAddMaterialOpen}
        projects={projects}
        records={records}
        onAddMaterial={handleAddMaterial}
        preselectedProjectId={addMaterialProjectId}
      />
    </>
  )
}
