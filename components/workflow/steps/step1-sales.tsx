"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmailSection } from "@/components/workflow/email-section"
import { FileUpload } from "@/components/workflow/file-upload"
import { BasicInfoForm } from "@/components/workflow/basic-info-form"
import { StatusTag } from "@/components/workflow/status-tag"
import { ApplicationFormModal } from "@/components/workflow/application-form-modal"
import type { BasicInfo, Step1Status, ChatMessage } from "@/types/workflow"
import { FileText, AlertCircle, Send, Database, ClipboardList, ArrowRight, X, MessageSquare } from "lucide-react"

// サンプルデータ
const SAMPLE_BASIC_INFO: BasicInfo = {
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
}

interface Step1SalesProps {
  status: Step1Status
  rejectionReason?: string
  basicInfo: BasicInfo
  policyDecided: boolean
  policySkipped: boolean
  chatHistory: ChatMessage[]
  onBasicInfoChange: (info: BasicInfo) => void
  onSendApplication: () => void
  onUploadApplication: (file: File) => void
  onRequestReview: () => void
  onProceedWithDelivery: () => void
  onSkipDelivery: () => void
  onSendMessage: (content: string, escalatedTo?: Supervisor[]) => void
}

export function Step1Sales({
  status,
  rejectionReason,
  basicInfo,
  policyDecided,
  policySkipped,
  chatHistory,
  onBasicInfoChange,
  onSendApplication,
  onUploadApplication,
  onRequestReview,
  onProceedWithDelivery,
  onSkipDelivery,
  onSendMessage,
}: Step1SalesProps) {
  const [applicationSent, setApplicationSent] = useState(false)
  const [applicationUploaded, setApplicationUploaded] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [customerResponse, setCustomerResponse] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [showChatInput, setShowChatInput] = useState(false)
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    
    const escalatedTo = SALES_SUPERVISORS.filter(s => selectedSupervisors.includes(s.id))
    onSendMessage(messageInput, escalatedTo.length > 0 ? escalatedTo : undefined)
    
    setMessageInput("")
    setSelectedSupervisors([])
  }

  const toggleSupervisor = (id: string) => {
    setSelectedSupervisors(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSendApplication = (content: string) => {
    setApplicationSent(true)
    onSendApplication()
  }

  const handleUpload = (file: File) => {
    setApplicationUploaded(true)
    setUploadedFileName(file.name)
    onUploadApplication(file)
  }

  const handleLoadSampleData = () => {
    setApplicationUploaded(true)
    setUploadedFileName("LINE広告申込書_サンプル.xlsx")
    onBasicInfoChange(SAMPLE_BASIC_INFO)
  }

  // 見送りの場合
  if (policySkipped) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5" />
              実施方針
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <X className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-lg font-medium text-muted-foreground">この案件は見送りになりました</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 実施方針未決定の場合
  if (!policyDecided) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5" />
              実施方針
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customerResponse" className="text-sm text-muted-foreground">
                顧客からの回答を記録してください
              </Label>
              <Textarea
                id="customerResponse"
                placeholder="顧客からの回答内容を入力..."
                value={customerResponse}
                onChange={(e) => setCustomerResponse(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onSkipDelivery}>
                見送る
              </Button>
              <Button onClick={onProceedWithDelivery}>
                <ArrowRight className="mr-2 h-4 w-4" />
                配信を進める
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 申込書送付 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            申込書送付
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* チャット履歴 */}
          {chatHistory.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-3">事務局との連絡</h4>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'sales' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'sales' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{msg.senderName}</span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        {msg.escalatedTo && msg.escalatedTo.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{msg.escalatedTo.map(s => s.name).join(", ")}へエスカレーション</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 space-y-3">
                <Textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="min-h-[80px]"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">上司へエスカレーション</Label>
                    <div className="flex flex-wrap gap-4">
                      {SALES_SUPERVISORS.map(supervisor => (
                        <div key={supervisor.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sup-${supervisor.id}`} 
                            checked={selectedSupervisors.includes(supervisor.id)}
                            onCheckedChange={() => toggleSupervisor(supervisor.id)}
                          />
                          <Label htmlFor={`sup-${supervisor.id}`} className="text-sm font-normal cursor-pointer">
                            {supervisor.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleSendMessage} className="self-end" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* チャット開始ボタン（履歴がない場合） */}
          {chatHistory.length === 0 && !showChatInput && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowChatInput(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                事務局へメッセージを送る
              </Button>
            </div>
          )}

          {/* チャット入力（履歴がない場合） */}
          {chatHistory.length === 0 && showChatInput && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-3">事務局へのメッセージ</h4>
              <div className="space-y-3">
                <Textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="min-h-[80px]"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">上司へエスカレーション</Label>
                    <div className="flex flex-wrap gap-4">
                      {SALES_SUPERVISORS.map(supervisor => (
                        <div key={supervisor.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sup-init-${supervisor.id}`} 
                            checked={selectedSupervisors.includes(supervisor.id)}
                            onCheckedChange={() => toggleSupervisor(supervisor.id)}
                          />
                          <Label htmlFor={`sup-init-${supervisor.id}`} className="text-sm font-normal cursor-pointer">
                            {supervisor.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowChatInput(false)} className="text-muted-foreground">
                      キャンセル
                    </Button>
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <EmailSection
            title="顧客へメール送信"
            defaultContent={`お世話になっております。

LINE広告のお申し込みについて、添付の申込書にご記入の上、
ご返送いただけますようお願いいたします。

ご不明点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。`}
            attachmentName="LINE広告申込書.xlsx"
            onSend={handleSendApplication}
            sent={applicationSent}
            onAttachmentClick={() => setShowApplicationForm(true)}
          />
        </CardContent>
      </Card>

      {/* 基本情報登録 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              基本情報登録
            </CardTitle>
            {status === "awaiting_review" && (
              <StatusTag status="reviewing" />
            )}
            {status === "rejected" && (
              <StatusTag status="rejected" />
            )}
            {status === "approved" && (
              <StatusTag status="approved" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 差し戻しの場合のアラート */}
          {status === "rejected" && rejectionReason && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>差し戻し内容</AlertTitle>
              <AlertDescription>{rejectionReason}</AlertDescription>
            </Alert>
          )}

          {/* 申込書アップロード */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                顧客から返送された申込書をアップロード
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadSampleData}
                disabled={status === "awaiting_review" || status === "approved"}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                <Database className="mr-1 h-3 w-3" />
                サンプル
              </Button>
            </div>
            <FileUpload
              onFileSelect={handleUpload}
              disabled={status === "awaiting_review" || status === "approved"}
              fileName={uploadedFileName || undefined}
              saved={applicationUploaded}
              onFileClick={() => setShowApplicationForm(true)}
            />
          </div>

          {/* 基本情報フォーム */}
          {applicationUploaded && (
            <>
              <div className="border-t pt-6">
                <BasicInfoForm
                  data={basicInfo}
                  onChange={onBasicInfoChange}
                  disabled={status === "awaiting_review" || status === "approved"}
                />
              </div>

              {/* 事務へ確認依頼ボタン */}
              {status !== "approved" && (
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={onRequestReview}
                    disabled={status === "awaiting_review"}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    事務へ確認依頼
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 申込書モーダル */}
      <ApplicationFormModal
        open={showApplicationForm}
        onOpenChange={setShowApplicationForm}
      />
    </div>
  )
}
