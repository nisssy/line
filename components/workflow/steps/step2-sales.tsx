"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { StatusTag } from "@/components/workflow/status-tag"
import { ConfirmModal } from "@/components/workflow/confirm-modal"
import { EmailSection } from "@/components/workflow/email-section"
import type { Step2Status } from "@/types/workflow"
import { User, Loader2, CheckCircle, XCircle, MessageSquare, Mail } from "lucide-react"

interface Step2SalesProps {
  status: Step2Status
  confirmationMessage?: string
  onReply: (content: string) => void
  onSendCustomerInquiry: (content: string) => void
}

export function Step2Sales({
  status,
  confirmationMessage,
  onReply,
  onSendCustomerInquiry,
}: Step2SalesProps) {
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showCustomerEmailModal, setShowCustomerEmailModal] = useState(false)

  const handleReply = (content: string) => {
    console.log("[v0] Sending reply:", content)
    onReply(content)
  }

  const handleSendCustomerEmail = (content: string) => {
    console.log("[v0] Sending customer inquiry email:", content)
    onSendCustomerInquiry(content)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              LINE広告アカウント申請
            </CardTitle>
            {status === "pending" && <StatusTag status="reviewing" />}
            {status === "success" && <StatusTag status="success" />}
            {status === "failed" && <StatusTag status="failed" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "pending" && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-info" />
              <p className="text-sm font-medium text-foreground">
                LINE広告アカウント申請中
              </p>
              <p className="text-xs text-muted-foreground">
                事務からの完了通知をお待ちください
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-success/30 bg-success/10 p-8">
              <CheckCircle className="mb-4 h-8 w-8 text-success" />
              <p className="text-sm font-medium text-success">
                LINE広告アカウント登録が完了しました
              </p>
              <p className="text-xs text-muted-foreground">
                次のステップ（配信レポート作成）に進んでいます
              </p>
            </div>
          )}

          {status === "failed" && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>事務からの確認依頼</AlertTitle>
                <AlertDescription>
                  {confirmationMessage || "確認が必要な事項があります。"}
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReplyModal(true)}
                  className="flex-1"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  回答
                </Button>
                <Button
                  onClick={() => setShowCustomerEmailModal(true)}
                  className="flex-1"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  顧客へ確認依頼
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 顧客への確認依頼メール表示 */}
      {showCustomerEmailModal && confirmationMessage && (
        <Card>
          <CardContent className="pt-6">
            <EmailSection
              title="顧客への確認依頼メール"
              defaultContent={`お世話になっております。

LINE広告のLINE広告アカウント登録につきまして、
以下の点についてご確認をお願いいたします。

【確認事項】
${confirmationMessage}

お手数をおかけいたしますが、ご回答をお願いいたします。

よろしくお願いいたします。`}
              onSend={handleSendCustomerEmail}
            />
          </CardContent>
        </Card>
      )}

      <ConfirmModal
        open={showReplyModal}
        onOpenChange={setShowReplyModal}
        onSubmit={handleReply}
        title="回答を入力"
        description="事務からの確認依頼に対する回答を入力してください。"
        inputLabel="回答内容"
        submitLabel="送信"
        placeholder="回答内容を記入してください..."
      />
    </div>
  )
}
