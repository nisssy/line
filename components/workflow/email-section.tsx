"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Paperclip, Send, Check } from "lucide-react"
import { NotificationModal } from "./notification-modal"

interface EmailSectionProps {
  title: string
  defaultContent: string
  attachmentName?: string
  onSend: (content: string) => void
  sent?: boolean
  onAttachmentClick?: () => void
  companyName?: string
  hallName?: string
}

export function EmailSection({
  title,
  defaultContent,
  attachmentName,
  onSend,
  sent = false,
  onAttachmentClick,
  companyName,
  hallName,
}: EmailSectionProps) {
  const [content, setContent] = useState(defaultContent)
  const [isSent, setIsSent] = useState(sent)
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleSend = (data: { message: string }) => {
    onSend(data.message || content)
    setIsSent(true)
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {attachmentName && (
          <button
            type="button"
            onClick={onAttachmentClick}
            className="flex w-full items-center gap-2 rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80 cursor-pointer text-left"
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground underline underline-offset-2">{attachmentName}</span>
            <span className="text-xs text-muted-foreground ml-auto">(クリックでプレビュー)</span>
          </button>
        )}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={isSent}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleOpenModal}
            disabled={isSent}
            className={isSent ? "bg-success hover:bg-success" : ""}
          >
            {isSent ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                送信済み
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                送信
              </>
            )}
          </Button>
        </div>

        <NotificationModal
          open={showModal}
          onOpenChange={setShowModal}
          onSend={handleSend}
          companyName={companyName}
          hallName={hallName}
        />
      </CardContent>
    </Card>
  )
}
