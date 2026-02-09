"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BasicInfo } from "@/types/workflow"

interface BasicInfoFormProps {
  data: BasicInfo
  onChange: (data: BasicInfo) => void
  disabled?: boolean
}

export function BasicInfoForm({ data, onChange, disabled = false }: BasicInfoFormProps) {
  const handleChange = (field: keyof BasicInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* お申込者様情報 */}
      <section>
        <h4 className="font-bold text-foreground border-b-2 border-foreground pb-1 mb-4 flex items-center gap-2">
          <span className="text-primary">▼</span>お申込者様情報
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">会社名 <span className="text-destructive">*</span></Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              disabled={disabled}
              placeholder="株式会社XXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hallName">ホール名 <span className="text-destructive">*</span></Label>
            <Input
              id="hallName"
              value={data.hallName}
              onChange={(e) => handleChange("hallName", e.target.value)}
              disabled={disabled}
              placeholder="XXXXX店"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="representativeName">担当者名</Label>
            <Input
              id="representativeName"
              value={data.representativeName}
              onChange={(e) => handleChange("representativeName", e.target.value)}
              disabled={disabled}
              placeholder="山田 太郎"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={disabled}
              placeholder="yamada@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={disabled}
              placeholder="03-1234-5678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">業種</Label>
            <Input
              id="businessType"
              value={data.businessType}
              onChange={(e) => handleChange("businessType", e.target.value)}
              disabled={disabled}
              placeholder="パチンコ・パチスロ店"
            />
          </div>
        </div>
      </section>

      {/* お申込内容 */}
      <section>
        <h4 className="font-bold text-foreground border-b-2 border-foreground pb-1 mb-4 flex items-center gap-2">
          <span className="text-primary">▼</span>お申込内容
        </h4>
        <div className="p-3 bg-muted rounded-lg mb-4">
          <span className="font-medium">LINE広告(サイト送客型)</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">開始日 <span className="text-destructive">*</span></Label>
            <Input
              id="startDate"
              type="date"
              value={data.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">終了日 <span className="text-destructive">*</span></Label>
            <Input
              id="endDate"
              type="date"
              value={data.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adBudget">運用金額(予算) <span className="text-destructive">*</span></Label>
            <Input
              id="adBudget"
              value={data.adBudget}
              onChange={(e) => handleChange("adBudget", e.target.value)}
              disabled={disabled}
              placeholder="500,000円"
            />
            <p className="text-xs text-muted-foreground">運用金額に対して20%をディレクション費用として頂戴いたします</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="commission">手数料</Label>
            <Input
              id="commission"
              value={data.commission}
              onChange={(e) => handleChange("commission", e.target.value)}
              disabled={disabled}
              placeholder="100,000円"
            />
            <p className="text-xs text-muted-foreground">運用金額の20%をご記入ください</p>
          </div>
        </div>
      </section>

      {/* ターゲット設定 */}
      <section>
        <h4 className="font-bold text-foreground border-b-2 border-foreground pb-1 mb-4 flex items-center gap-2">
          <span className="text-primary">▼</span>ターゲット設定
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="areaSpecification">地域指定 <span className="text-destructive">*</span></Label>
            <Textarea
              id="areaSpecification"
              value={data.areaSpecification}
              onChange={(e) => handleChange("areaSpecification", e.target.value)}
              disabled={disabled}
              placeholder="北海道札幌市西区発寒6条9丁目3番1号より半径5km"
              className="min-h-[60px]"
            />
            <p className="text-xs text-muted-foreground">都道府県指定の場合は都道府県名から、半径指定の場合は起点の住所と半径を入力してください</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">ターゲット <span className="text-destructive">*</span></Label>
            <Select
              value={data.targetAudience}
              onValueChange={(value) => handleChange("targetAudience", value)}
              disabled={disabled}
            >
              <SelectTrigger id="targetAudience">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="この地域に住んでいる人">この地域に住んでいる人</SelectItem>
                <SelectItem value="この地域で働いている人">この地域で働いている人</SelectItem>
                <SelectItem value="この地域に最近いた人">この地域に最近いた人</SelectItem>
                <SelectItem value="この地域を最近訪れた人">この地域を最近訪れた人</SelectItem>
                <SelectItem value="この地域へ旅行中の人">この地域へ旅行中の人</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ageGroup">年齢指定 <span className="text-destructive">*</span></Label>
            <Select
              value={data.ageGroup}
              onValueChange={(value) => handleChange("ageGroup", value)}
              disabled={disabled}
            >
              <SelectTrigger id="ageGroup">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="すべて">すべて(20歳未満には配信されません)</SelectItem>
                <SelectItem value="20-24歳">20-24歳</SelectItem>
                <SelectItem value="25-29歳">25-29歳</SelectItem>
                <SelectItem value="30-34歳">30-34歳</SelectItem>
                <SelectItem value="35-39歳">35-39歳</SelectItem>
                <SelectItem value="40-44歳">40-44歳</SelectItem>
                <SelectItem value="45-49歳">45-49歳</SelectItem>
                <SelectItem value="50-54歳">50-54歳</SelectItem>
                <SelectItem value="55-59歳">55-59歳</SelectItem>
                <SelectItem value="60-64歳">60-64歳</SelectItem>
                <SelectItem value="65歳以上">65歳以上</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">複数選択可</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">性別 <span className="text-destructive">*</span></Label>
            <Select
              value={data.gender}
              onValueChange={(value) => handleChange("gender", value)}
              disabled={disabled}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="指定なし">指定なし</SelectItem>
                <SelectItem value="男性">男性</SelectItem>
                <SelectItem value="女性">女性</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">住所</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={disabled}
              placeholder="東京都渋谷区..."
            />
          </div>
        </div>
      </section>

      {/* 備考 */}
      <section>
        <h4 className="font-bold text-foreground border-b-2 border-foreground pb-1 mb-4 flex items-center gap-2">
          <span className="text-primary">▼</span>備考
        </h4>
        <Textarea
          id="notes"
          value={data.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          disabled={disabled}
          placeholder="その他ご要望など"
          className="min-h-[80px]"
        />
      </section>
    </div>
  )
}
