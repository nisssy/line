"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BasicInfoForm } from "@/components/workflow/basic-info-form"
import { RejectionModal } from "@/components/workflow/rejection-modal"
import type { BasicInfo, Step1Status } from "@/types/workflow"
import { FileText, Check, X } from "lucide-react"

interface Step1OfficeProps {
  status: Step1Status
  basicInfo: BasicInfo
  onApprove: () => void
  onReject: (reason: string) => void
}

export function Step1Office({
  status,
  basicInfo,
  onApprove,
  onReject,
}: Step1OfficeProps) {
  const [showRejectionModal, setShowRejectionModal] = useState(false)

  const isReviewable = status === "awaiting_review"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            基本情報登録
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "pending" && (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
              <p className="text-sm text-muted-foreground">
                営業からの確認依頼をお待ちください
              </p>
            </div>
          )}

          {(status === "awaiting_review" || status === "rejected" || status === "approved") && (
            <>
              <BasicInfoForm data={basicInfo} onChange={() => {}} disabled />

              {isReviewable && (
                <div className="flex justify-end gap-3 border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectionModal(true)}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <X className="mr-2 h-4 w-4" />
                    差し戻し
                  </Button>
                  <Button onClick={onApprove}>
                    <Check className="mr-2 h-4 w-4" />
                    登録
                  </Button>
                </div>
              )}

              {status === "approved" && (
                <div className="rounded-lg bg-success/10 p-4 text-center">
                  <p className="text-sm font-medium text-success">
                    登録完了 - 次のステップに進んでいます
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <RejectionModal
        open={showRejectionModal}
        onOpenChange={setShowRejectionModal}
        onSubmit={onReject}
      />
    </div>
  )
}
