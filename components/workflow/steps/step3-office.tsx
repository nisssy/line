"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/workflow/file-upload"
import { ReportPreviewModal } from "@/components/workflow/report-preview-modal"
import type { IntermediateReport } from "@/types/workflow"
import { BarChart3, FileText, Plus, Save, Database } from "lucide-react"

interface Step3OfficeProps {
  intermediateReports: IntermediateReport[]
  finalReport?: {
    fileUrl?: string
    fileName?: string
    uploadedAt?: string
  }
  onUploadIntermediateReport: (reportId: string, file: File) => void
  onAddIntermediateReport: () => void
  onUploadFinalReport: (file: File) => void
  onSaveIntermediateReport: (reportId: string) => void
  onSaveFinalReport: () => void
  onLoadSampleIntermediateReport: (reportId: string, fileName: string) => void
  onLoadSampleFinalReport: (fileName: string) => void
}

export function Step3Office({
  intermediateReports,
  finalReport,
  onUploadIntermediateReport,
  onAddIntermediateReport,
  onUploadFinalReport,
  onSaveIntermediateReport,
  onSaveFinalReport,
  onLoadSampleIntermediateReport,
  onLoadSampleFinalReport,
}: Step3OfficeProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})
  const [savedFiles, setSavedFiles] = useState<Record<string, boolean>>({})
  const [finalFileName, setFinalFileName] = useState<string | undefined>(finalReport?.fileName)
  const [finalSaved, setFinalSaved] = useState(false)
  const [previewModal, setPreviewModal] = useState<{
    open: boolean
    type: "intermediate" | "final"
    index: number
  }>({ open: false, type: "intermediate", index: 1 })

  const handleUploadIntermediate = (reportId: string) => (file: File) => {
    setUploadedFiles(prev => ({ ...prev, [reportId]: file.name }))
    onUploadIntermediateReport(reportId, file)
  }

  const handleUploadFinal = (file: File) => {
    setFinalFileName(file.name)
    onUploadFinalReport(file)
  }

  const handleSaveIntermediate = (reportId: string) => () => {
    setSavedFiles(prev => ({ ...prev, [reportId]: true }))
    onSaveIntermediateReport(reportId)
  }

  const handleSaveFinal = () => {
    setFinalSaved(true)
    onSaveFinalReport()
  }

  const handleLoadSampleIntermediate = (reportId: string, index: number) => {
    const sampleFileName = `中間報告_${index + 1}_広告実績レポート_サンプル.xlsx`
    setUploadedFiles(prev => ({ ...prev, [reportId]: sampleFileName }))
    onLoadSampleIntermediateReport(reportId, sampleFileName)
  }

  const handleLoadSampleFinal = () => {
    const sampleFileName = "最終報告_広告実績レポート_サンプル.xlsx"
    setFinalFileName(sampleFileName)
    onLoadSampleFinalReport(sampleFileName)
  }

  const openIntermediatePreview = (index: number) => {
    setPreviewModal({ open: true, type: "intermediate", index: index + 1 })
  }

  const openFinalPreview = () => {
    setPreviewModal({ open: true, type: "final", index: 1 })
  }

  return (
    <div className="space-y-6">
      {/* 中間報告 */}
      {intermediateReports.map((report, index) => (
        <Card key={report.id}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              {report.title || `中間報告${index + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">広告実績レポートのアップロード</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLoadSampleIntermediate(report.id, index)}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Database className="mr-1 h-3 w-3" />
                  サンプル
                </Button>
              </div>
              <FileUpload
                onFileSelect={handleUploadIntermediate(report.id)}
                fileName={uploadedFiles[report.id] || report.fileName}
                saved={savedFiles[report.id] || report.saved}
                onFileClick={() => openIntermediatePreview(index)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSaveIntermediate(report.id)}
                disabled={!uploadedFiles[report.id] && !report.fileName}
              >
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 中間報告を追加ボタン */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={onAddIntermediateReport}>
          <Plus className="mr-2 h-4 w-4" />
          中間報告を追加
        </Button>
      </div>

      {/* 最終報告 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            最終報告
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">広告実績レポートのアップロード</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadSampleFinal}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                <Database className="mr-1 h-3 w-3" />
                サンプル
              </Button>
            </div>
            <FileUpload
              onFileSelect={handleUploadFinal}
              fileName={finalFileName}
              saved={finalSaved || finalReport?.saved}
              onFileClick={openFinalPreview}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveFinal} disabled={!finalFileName}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* プレビューモーダル */}
      <ReportPreviewModal
        open={previewModal.open}
        onOpenChange={(open) => setPreviewModal((prev) => ({ ...prev, open }))}
        reportType={previewModal.type}
        reportIndex={previewModal.index}
      />
    </div>
  )
}
