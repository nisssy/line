"use client"

import { useState } from "react"
import { ProjectList, sampleProjects } from "@/components/projects/project-list"
import { ProjectDetail } from "@/components/projects/project-detail"
import { ProjectForm } from "@/components/projects/project-form"
import type { Project, ProjectStatus } from "@/types/workflow"

type ViewMode = "list" | "detail" | "create"

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>(sampleProjects)

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    setViewMode("detail")
  }

  const handleCreateProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev])
    setViewMode("list")
  }

  const handleBack = () => {
    setSelectedProjectId(null)
    setViewMode("list")
  }

  const handleStatusChange = (status: ProjectStatus) => {
    if (!selectedProjectId) return
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProjectId ? { ...p, status } : p
      )
    )
  }

  if (viewMode === "detail" && selectedProjectId) {
    return <ProjectDetail projectId={selectedProjectId} onBack={handleBack} onStatusChange={handleStatusChange} />
  }

  if (viewMode === "create") {
    return <ProjectForm onBack={handleBack} onSubmit={handleCreateProject} />
  }

  return (
    <ProjectList
      onSelectProject={handleSelectProject}
      onCreateProject={() => setViewMode("create")}
      projects={projects}
    />
  )
}
