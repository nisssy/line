"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailSection } from "@/components/workflow/email-section"
import { FileUpload } from "@/components/workflow/file-upload"
import { ReportPreviewModal } from "@/components/workflow/report-preview-modal"
import type { IntermediateReport } from "@/types/workflow"
import { BarChart3, FileText } from "lucide-react"

interface Step3SalesProps {
  intermediateReports: IntermediateReport[]
  finalReport?: {
    fileUrl?: string
    fileName?: string
    uploadedAt?: string
    sentToCustomer?: boolean
  }
  onSendIntermediateReport: (reportId: string, content: string) => void
  onSendFinalReport: (content: string) => void
}

export function Step3Sales({
  intermediateReports,
  finalReport,
  onSendIntermediateReport,
  onSendFinalReport,
}: Step3SalesProps) {
  const [previewModal, setPreviewModal] = useState<{
    open: boolean
    type: "intermediate" | "final"
    index: number
  }>({ open: false, type: "intermediate", index: 1 })

  const handleSendReport = (reportId: string) => (content: string) => {
    onSendIntermediateReport(reportId, content)
  }

  const handleSendFinal = (content: string) => {
    onSendFinalReport(content)
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
              <p className="text-sm font-medium text-foreground">広告実績レポート</p>
              <FileUpload
                onFileSelect={() => {}}
                fileName={report.fileName}
                viewOnly
                onFileClick={() => openIntermediatePreview(index)}
              />
            </div>
            {report.fileName && (
              <EmailSection
                title="顧客へメール送信"
                defaultContent={`お世話になっております。

LINE広告の運用状況につきまして、中間報告をお送りいたします。

添付の広告実績レポートをご確認ください。

ご不明点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。`}
                attachmentName={report.fileName}
                onSend={handleSendReport(report.id)}
                sent={report.sentToCustomer}
                onAttachmentClick={() => openIntermediatePreview(index)}
              />
            )}
          </CardContent>
        </Card>
      ))}

      {/* 中間報告がない場合 */}
      {intermediateReports.length === 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              中間報告
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
              <p className="text-sm text-muted-foreground">
                事務からのレポートアップロードをお待ちください
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
            <p className="text-sm font-medium text-foreground">広告実績レポート</p>
            <FileUpload
              onFileSelect={() => {}}
              fileName={finalReport?.fileName}
              viewOnly
              onFileClick={openFinalPreview}
            />
          </div>
          {finalReport?.fileName && (
            <EmailSection
              title="顧客へメール送信"
              defaultContent={`お世話になっております。

LINE広告の運用期間が終了いたしましたので、
最終報告をお送りいたします。

添付の広告実績レポートをご確認ください。

今後ともよろしくお願いいたします。`}
              attachmentName={finalReport.fileName}
              onSend={handleSendFinal}
              sent={finalReport.sentToCustomer}
              onAttachmentClick={openFinalPreview}
            />
          )}
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
