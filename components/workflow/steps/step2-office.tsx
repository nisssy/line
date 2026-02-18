"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmModal } from "@/components/workflow/confirm-modal"
import type { Step2Status, SelectedAccount, ChatMessage, Supervisor } from "@/types/workflow"
import {
  User,
  CheckCircle,
  MessageSquare,
  Plus,
  ExternalLink,
  ArrowLeft,
  Ban,
  RefreshCw,
} from "lucide-react"

const initialAccounts = [
  { id: "acc-1", name: "サンプル広告アカウント A", accountId: "LA-00012345", status: "active" as const },
  { id: "acc-2", name: "サンプル広告アカウント B", accountId: "LA-00067890", status: "active" as const },
  { id: "acc-3", name: "テスト配信用アカウント", accountId: "LA-00099999", status: "active" as const },
]

type AccountStatus = "active" | "disabled"
type LocalView = "account_list" | "new_creation" | "applied"

interface AccountItem {
  id: string
  name: string
  accountId: string
  status: AccountStatus
}

interface Step2OfficeProps {
  status: Step2Status
  salesReply?: string
  chatHistory: ChatMessage[]
  selectedAccount?: SelectedAccount
  hasExistingAccounts?: boolean
  onMarkAsApplied: () => void
  onComplete: () => void
  onSelectAccount: (account: SelectedAccount) => void
  onResetAccount: () => void
  onRequestConfirmation: (content: string) => void
  onSendMessage: (content: string, escalatedTo?: Supervisor[]) => void
}

export function Step2Office({
  status,
  salesReply,
  chatHistory,
  selectedAccount,
  hasExistingAccounts = true,
  onMarkAsApplied,
  onComplete,
  onSelectAccount,
  onResetAccount,
  onRequestConfirmation,
  onSendMessage,
}: Step2OfficeProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [accounts, setAccounts] = useState<AccountItem[]>(
    hasExistingAccounts ? initialAccounts : []
  )
  const [localView, setLocalView] = useState<LocalView>(
    hasExistingAccounts ? "account_list" : "new_creation"
  )

  const handleUseAccount = (account: AccountItem) => {
    onSelectAccount({ id: account.id, name: account.name, accountId: account.accountId })
  }

  const handleChangeAccount = () => {
    onResetAccount()
    setLocalView("account_list")
  }

  const handleDisableAccount = () => {
    if (selectedAccount) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === selectedAccount.id ? { ...acc, status: "disabled" as const } : acc
        )
      )
    }
    onResetAccount()
    setLocalView("account_list")
  }

  const handleNewCreation = () => {
    setLocalView("new_creation")
  }

  const handleMarkAsApplied = () => {
    setLocalView("applied")
    onMarkAsApplied()
  }

  const handleRegistrationComplete = () => {
    const newAccount = {
      id: "new-created-account",
      name: "新規作成アカウント",
      accountId: "新規発行"
    }
    onSelectAccount(newAccount)
  }

  const handleRequestConfirmation = (content: string) => {
    onRequestConfirmation(content)
  }

  if (selectedAccount) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              LYM広告アカウント選択
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">使用中のアカウント</h4>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{selectedAccount.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedAccount.accountId}</p>
                </div>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  使用中
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleChangeAccount} className="flex-1 bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                アカウントを変更
              </Button>
              <Button variant="outline" onClick={handleDisableAccount} className="flex-1 text-destructive hover:text-destructive bg-transparent">
                <Ban className="mr-2 h-4 w-4" />
                使用不可
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success" && localView !== "applied") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              LINE広告アカウント選択
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-lg border border-primary/30 bg-primary/5 p-8">
              <CheckCircle className="mb-4 h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-primary">
                LINE広告アカウント登録が完了しました
              </p>
              <p className="text-xs text-muted-foreground">
                次のステップ（配信レポート作成）に進んでいます
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (localView === "applied") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              LINE広告アカウント選択
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                LINE広告アカウントの申請が完了しました。登録状況を選択してください。
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(true)}
                className="flex-1"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                営業へ確認依頼
              </Button>
              <Button onClick={handleRegistrationComplete} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                登録完了
              </Button>
            </div>
          </CardContent>
        </Card>

        <ConfirmModal
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          onSubmit={handleRequestConfirmation}
          title="営業へ確認依頼"
          description="確認が必要な内容を入力してください。"
          inputLabel="確認内容"
          submitLabel="営業へ確認依頼"
          placeholder="確認が必要な内容を記入してください..."
        />
      </div>
    )
  }

  if (localView === "new_creation") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              LINE広告アカウント選択
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {accounts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocalView("account_list")}
                className="text-muted-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                アカウント一覧に戻る
              </Button>
            )}

            <div className="rounded-lg border border-border bg-muted/30 p-6 space-y-4">
              <p className="text-sm text-foreground">
                以下のリンクからLYMアカウントを作成してください
              </p>
              <a
                href="https://lymcampus.jp/line-ads/courses/preparation/lessons/da-2-2-2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-2"
              >
                <ExternalLink className="h-4 w-4" />
                LYMアカウント作成ページを開く
              </a>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleMarkAsApplied} size="lg">
                <CheckCircle className="mr-2 h-5 w-5" />
                申請済み
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            LINE広告アカウント選択
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-foreground">{account.name}</p>
                    <p className="text-sm text-muted-foreground">{account.accountId}</p>
                  </div>
                  {account.status === "disabled" && (
                    <Badge variant="destructive" className="text-xs">
                      使用不可
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleUseAccount(account)}
                  disabled={account.status === "disabled"}
                >
                  使用する
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Button variant="outline" onClick={handleNewCreation}>
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
