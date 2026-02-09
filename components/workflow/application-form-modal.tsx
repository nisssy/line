"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ApplicationFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicationFormModal({ open, onOpenChange }: ApplicationFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">
              DMMぱちタウン LINE広告申込書
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Ver.1.04</span>
              <span className="text-lg font-bold text-accent">DMMぱちタウン</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">合同会社 DMM.com 宛</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* お申込者様情報 */}
          <section>
            <h3 className="font-bold text-foreground border-b-2 border-foreground pb-1 mb-3 flex items-center gap-2">
              <span className="text-primary">▼</span>お申込者様情報
              <span className="ml-4 text-sm font-normal text-muted-foreground">申し込み日:20XX年 X月 XX日</span>
            </h3>
            <div className="space-y-2 pl-4">
              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[80px]">■会社名</span>
                <span className="text-foreground">株式会社XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[80px]">■ホール名</span>
                <span className="text-foreground">XXXXX店</span>
              </div>
            </div>
          </section>

          {/* お申込内容 */}
          <section>
            <h3 className="font-bold text-foreground border-b-2 border-foreground pb-1 mb-3 flex items-center gap-2">
              <span className="text-primary">▼</span>お申込内容
            </h3>
            <div className="pl-4 p-3 bg-muted rounded-lg">
              <span className="font-medium">LINE広告(サイト送客型)</span>
            </div>
          </section>

          {/* 利用規約 */}
          <section>
            <h3 className="font-bold text-foreground border-b-2 border-foreground pb-1 mb-3 flex items-center gap-2">
              <span className="text-primary">▼</span>利用規約
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-muted/50 max-h-[200px] overflow-y-auto">
                <p className="text-xs text-muted-foreground font-bold mb-2">ご確認事項</p>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>LINE広告ご注文の方下記をご確認ください。LINEヤフー株式会社(以下「LINE社」という)の広告枠を通じ株式会社DMMぱちタウンMarketing Partners(以下「DMP」という)により配信いたします。</p>
                  <p>広告配信サービス名:LINE Marketing Partnersサポート枠LINE広告配信サービス(本規約)</p>
                  <p>*お申し込みの際下記をご参照いただいた上で申込の記入をお願いします。ターゲット等細かい内容をご記載いただけますと、ご希望に沿った内容にて配信させていただきます。</p>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t pt-3">
                  <Checkbox id="agree" />
                  <Label htmlFor="agree" className="text-xs">
                    ※ご確認いただきましたらチェックをお願いいたします。
                  </Label>
                </div>
              </div>
              
              {/* 右側の入力項目テーブル */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border-b border-r px-3 py-2 text-left font-medium">項目</th>
                      <th className="border-b border-r px-3 py-2 text-left font-medium">記入・選択欄</th>
                      <th className="border-b px-3 py-2 text-left font-medium text-xs">備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b border-r px-3 py-2 font-medium">開始<span className="text-destructive">*</span></td>
                      <td className="border-b border-r px-3 py-2 text-muted-foreground">(20XX)年( )月( )日</td>
                      <td className="border-b px-3 py-2 text-xs text-muted-foreground"></td>
                    </tr>
                    <tr>
                      <td className="border-b border-r px-3 py-2 font-medium">終了<span className="text-destructive">*</span></td>
                      <td className="border-b border-r px-3 py-2 text-muted-foreground">~(20XX)年( )月( )日</td>
                      <td className="border-b px-3 py-2 text-xs text-muted-foreground"></td>
                    </tr>
                    <tr>
                      <td className="border-b border-r px-3 py-2 font-medium">運用金額(予算)<span className="text-destructive">*</span></td>
                      <td className="border-b border-r px-3 py-2 text-muted-foreground">( )円</td>
                      <td className="border-b px-3 py-2 text-xs text-muted-foreground">運用金額に対して20%をディレクション費用として頂戴いたします</td>
                    </tr>
                    <tr>
                      <td className="border-b border-r px-3 py-2 font-medium">手数料</td>
                      <td className="border-b border-r px-3 py-2 text-muted-foreground">( )円</td>
                      <td className="border-b px-3 py-2 text-xs text-muted-foreground">運用金額の20%をご記入ください</td>
                    </tr>
                    <tr>
                      <td className="border-b border-r px-3 py-2 font-medium">地域指定<span className="text-destructive">*</span></td>
                      <td className="border-b border-r px-3 py-2 text-muted-foreground text-xs">北海道札幌市西区発寒6条9丁目3番1号より半径5km</td>
                      <td className="border-b px-3 py-2 text-xs text-muted-foreground">都道府県指定の場合は都道府県名から記入ください。半径指定の場合は起点の住所と半径を入力してください。</td>
                    </tr>
                    <tr>
                      <td className="border-b border-r px-3 py-2 font-medium">ターゲット<span className="text-destructive">*</span></td>
                      <td className="border-b border-r px-3 py-2 text-xs text-muted-foreground">
                        <div className="space-y-1">
                          <p>□この地域に住んでいる人、□この地域で働いている人、□この地域に最近いた人、</p>
                          <p>□この地域を最近訪れた人、□この地域へ旅行中の人</p>
                        </div>
                      </td>
                      <td className="border-b px-3 py-2 text-xs text-muted-foreground">いずれか1つを選択してください</td>
                    </tr>
                    <tr>
                      <td className="border-b border-r px-3 py-2 font-medium">年齢指定<span className="text-destructive">*</span></td>
                      <td className="border-b border-r px-3 py-2 text-xs text-muted-foreground">
                        <p>□すべて(20歳未満には配信されません)</p>
                        <p>□20-24歳□25-29歳□30-34歳□35-39歳□40-44歳□45-49歳</p>
                        <p>□50-54歳□55-59歳□60-64歳□65歳以上</p>
                      </td>
                      <td className="border-b px-3 py-2 text-xs text-muted-foreground">複数選択可</td>
                    </tr>
                    <tr>
                      <td className="border-r px-3 py-2 font-medium">性別<span className="text-destructive">*</span></td>
                      <td className="border-r px-3 py-2 text-muted-foreground">□指定なし □男性 □女性</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">いずれか1つを選択してください</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
