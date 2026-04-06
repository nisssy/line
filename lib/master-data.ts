import type { CompanyData, HallData, EmployeeData } from "@/types/workflow"

// --- 従業員マスタ（50人） ---
export const initialEmployees: EmployeeData[] = [
  { id: 1, name: "山田 太郎", email: "yamada@example.com", department: "営業部" },
  { id: 2, name: "佐藤 次郎", email: "sato@example.com", department: "営業部" },
  { id: 3, name: "鈴木 三郎", email: "suzuki@example.com", department: "営業部" },
  { id: 4, name: "高橋 四郎", email: "takahashi@example.com", department: "営業部" },
  { id: 5, name: "伊藤 五郎", email: "ito@example.com", department: "営業部" },
  { id: 6, name: "渡辺 六郎", email: "watanabe@example.com", department: "営業部" },
  { id: 7, name: "中村 七郎", email: "nakamura@example.com", department: "営業部" },
  { id: 8, name: "小林 八郎", email: "kobayashi@example.com", department: "営業部" },
  { id: 9, name: "加藤 九郎", email: "kato@example.com", department: "営業部" },
  { id: 10, name: "松本 十郎", email: "matsumoto@example.com", department: "営業部" },
  { id: 11, name: "井上 十一", email: "inoue@example.com", department: "営業部" },
  { id: 12, name: "木村 十二", email: "kimura@example.com", department: "営業部" },
  { id: 13, name: "林 十三", email: "hayashi@example.com", department: "営業部" },
  { id: 14, name: "斎藤 十四", email: "saito@example.com", department: "営業部" },
  { id: 15, name: "清水 十五", email: "shimizu@example.com", department: "営業部" },
  { id: 16, name: "山本 十六", email: "yamamoto@example.com", department: "営業部" },
  { id: 17, name: "森 十七", email: "mori@example.com", department: "営業部" },
  { id: 18, name: "池田 十八", email: "ikeda@example.com", department: "営業部" },
  { id: 19, name: "橋本 十九", email: "hashimoto@example.com", department: "営業部" },
  { id: 20, name: "石川 二十", email: "ishikawa@example.com", department: "営業部" },
  { id: 21, name: "田中 一郎", email: "tanaka@example.com", department: "営業部" },
  { id: 22, name: "佐々木 二郎", email: "sasaki@example.com", department: "営業部" },
  { id: 23, name: "山口 三郎", email: "yamaguchi@example.com", department: "営業部" },
  { id: 24, name: "松井 四郎", email: "matsui@example.com", department: "営業部" },
  { id: 25, name: "村上 五郎", email: "murakami@example.com", department: "営業部" },
  { id: 26, name: "前田 六郎", email: "maeda@example.com", department: "営業部" },
  { id: 27, name: "長谷川 七郎", email: "hasegawa@example.com", department: "営業部" },
  { id: 28, name: "藤田 八郎", email: "fujita@example.com", department: "営業部" },
  { id: 29, name: "近藤 九郎", email: "kondo@example.com", department: "営業部" },
  { id: 30, name: "遠藤 十郎", email: "endo@example.com", department: "営業部" },
  { id: 31, name: "青木 花子", email: "aoki@example.com", department: "管理部" },
  { id: 32, name: "新井 美咲", email: "arai@example.com", department: "管理部" },
  { id: 33, name: "荒井 さくら", email: "arai2@example.com", department: "管理部" },
  { id: 34, name: "石井 みゆき", email: "ishii@example.com", department: "管理部" },
  { id: 35, name: "上田 あかり", email: "ueda@example.com", department: "管理部" },
  { id: 36, name: "内田 ゆい", email: "uchida@example.com", department: "管理部" },
  { id: 37, name: "江藤 まい", email: "eto@example.com", department: "管理部" },
  { id: 38, name: "大野 りん", email: "ono@example.com", department: "管理部" },
  { id: 39, name: "小野 なな", email: "ono2@example.com", department: "管理部" },
  { id: 40, name: "尾崎 はるか", email: "ozaki@example.com", department: "管理部" },
  { id: 41, name: "岡田 健", email: "okada@example.com", department: "経理部" },
  { id: 42, name: "奥田 誠", email: "okuda@example.com", department: "経理部" },
  { id: 43, name: "片山 智", email: "katayama@example.com", department: "経理部" },
  { id: 44, name: "金田 勇", email: "kaneda@example.com", department: "経理部" },
  { id: 45, name: "川上 剛", email: "kawakami@example.com", department: "経理部" },
  { id: 46, name: "河野 進", email: "kono@example.com", department: "経理部" },
  { id: 47, name: "菊地 優", email: "kikuchi@example.com", department: "経理部" },
  { id: 48, name: "工藤 大", email: "kudo@example.com", department: "経理部" },
  { id: 49, name: "久保 翔", email: "kubo@example.com", department: "経理部" },
  { id: 50, name: "黒田 亮", email: "kuroda@example.com", department: "経理部" },
]

// --- 法人マスタ（10社） ---
export const initialCompanies: CompanyData[] = [
  { id: 1, companyId: "CORP-001", name: "株式会社マルハン", email: "maruhan@example.com" },
  { id: 2, companyId: "CORP-002", name: "株式会社ダイナム", email: "dynam@example.com" },
  { id: 3, companyId: "CORP-003", name: "株式会社ガイア", email: "gaia@example.com" },
  { id: 4, companyId: "CORP-004", name: "株式会社エース", email: "ace@example.com" },
  { id: 5, companyId: "CORP-005", name: "株式会社サンライズ", email: "sunrise@example.com" },
  { id: 6, companyId: "CORP-006", name: "株式会社ビッグエース", email: "bigace@example.com" },
  { id: 7, companyId: "CORP-007", name: "株式会社パチンコランド", email: "pachinkoland@example.com" },
  { id: 8, companyId: "CORP-008", name: "株式会社エースパチンコ", email: "acepachinko@example.com" },
  { id: 9, companyId: "CORP-009", name: "株式会社パチンコワールド", email: "pachinkoworld@example.com" },
  { id: 10, companyId: "CORP-010", name: "株式会社ビッグパチンコ", email: "bigpachinko@example.com" },
]

// --- ホールデータ生成（10法人 × 20ホール = 200ホール） ---
const LOCATIONS = [
  "本店", "渋谷店", "新宿店", "池袋店", "上野店",
  "錦糸町店", "新橋店", "横浜店", "川崎店", "大宮店",
  "千葉店", "船橋店", "柏店", "立川店", "八王子店",
  "町田店", "相模原店", "厚木店", "藤沢店", "鎌倉店",
]

const PREFECTURES = [
  "東京都", "東京都", "東京都", "東京都", "東京都",
  "東京都", "東京都", "神奈川県", "神奈川県", "埼玉県",
  "千葉県", "千葉県", "千葉県", "東京都", "東京都",
  "東京都", "神奈川県", "神奈川県", "神奈川県", "神奈川県",
]

function generateRandomDiscount(): number {
  return (Math.floor(Math.random() * 10) + 1) * 5000
}

const generateInitialHalls = (): HallData[] => {
  const halls: HallData[] = []
  let hallCounter = 1
  const employeeNames = initialEmployees.map((e) => e.name)

  initialCompanies.forEach((company, companyIndex) => {
    for (let i = 1; i <= 20; i++) {
      const salesPersonIndex = (companyIndex * 20 + i - 1) % employeeNames.length
      const hallNumber = String(i).padStart(2, "0")
      const location = LOCATIONS[i - 1]
      const companyShortName = company.name.replace("株式会社", "")

      halls.push({
        id: hallCounter,
        hallId: `${company.companyId}-HALL-${hallNumber}`,
        name: `${companyShortName}${location}`,
        address: `${PREFECTURES[i - 1]}...`,
        email: `${company.companyId.toLowerCase()}-hall-${hallNumber}@example.com`,
        salesPersonName: employeeNames[salesPersonIndex],
        companyId: company.id,
        discountAmount: generateRandomDiscount(),
        prefecture: PREFECTURES[i - 1],
      })
      hallCounter++
    }
  })
  return halls
}

export const initialHalls: HallData[] = generateInitialHalls()

// --- 部マスタ ---
export const DEPARTMENT_OPTIONS = [
  "営業部",
  "管理部",
  "経理部",
  "企画部",
  "マーケティング部",
]

// --- エリアマスタ ---
export const AREA_OPTIONS = [
  "東京本社①",
  "東京本社②",
  "関東①",
  "関東②",
  "関東③",
  "大手法人",
  "関西",
  "中部",
  "九州",
  "東北",
  "北海道",
]

// --- 商品カテゴリマスタ ---
export const MATERIAL_CATEGORY_OPTIONS = [
  "イベント",
  "オプション",
  "ポイント",
]

// --- 検索ロジック ---

export function searchHalls(halls: HallData[], query: string, companyId?: number): HallData[] {
  let filtered = halls
  if (companyId !== undefined) {
    filtered = filtered.filter((h) => h.companyId === companyId)
  }
  if (!query) return filtered
  const q = query.toLowerCase()
  return filtered.filter((h) => h.name.toLowerCase().includes(q))
}

export function searchCompanies(companies: CompanyData[], query: string): CompanyData[] {
  if (!query) return companies
  const q = query.toLowerCase()
  return companies.filter(
    (c) => c.name.toLowerCase().includes(q) || c.companyId.toLowerCase().includes(q)
  )
}

export function findCompanyByCompanyId(companies: CompanyData[], companyId: string): CompanyData | null {
  return companies.find((c) => c.companyId === companyId) || null
}

export function getHallsByCompanyId(halls: HallData[], companyId: number): HallData[] {
  return halls.filter((h) => h.companyId === companyId)
}
