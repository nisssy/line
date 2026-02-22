"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Building2, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { CompanyData, HallData } from "@/types/workflow"
import {
  initialCompanies,
  initialHalls,
  searchCompanies,
  searchHalls,
} from "@/lib/master-data"

interface CompanyHallComboboxProps {
  selectedCompany: CompanyData | null
  selectedHall: HallData | null
  onSelectCompany: (company: CompanyData | null) => void
  onSelectHall: (hall: HallData | null) => void
  disabled?: boolean
}

export function CompanyHallCombobox({
  selectedCompany,
  selectedHall,
  onSelectCompany,
  onSelectHall,
  disabled = false,
}: CompanyHallComboboxProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"company" | "hall">("company")
  const [companyQuery, setCompanyQuery] = useState("")
  const [hallQuery, setHallQuery] = useState("")

  const filteredCompanies = useMemo(
    () => searchCompanies(initialCompanies, companyQuery),
    [companyQuery]
  )

  const filteredHalls = useMemo(
    () => searchHalls(initialHalls, hallQuery, selectedCompany?.id),
    [hallQuery, selectedCompany?.id]
  )

  const handleSelectCompany = (company: CompanyData) => {
    if (selectedCompany?.id === company.id) {
      onSelectCompany(null)
      onSelectHall(null)
    } else {
      onSelectCompany(company)
      onSelectHall(null)
    }
    setCompanyQuery("")
    setOpen(false)
  }

  const handleSelectHall = (hall: HallData) => {
    if (selectedHall?.id === hall.id) {
      onSelectHall(null)
      onSelectCompany(null)
    } else {
      onSelectHall(hall)
      const parentCompany = initialCompanies.find((c) => c.id === hall.companyId)
      if (parentCompany) {
        onSelectCompany(parentCompany)
      }
    }
    setHallQuery("")
    setOpen(false)
  }

  const displayLabel = selectedHall
    ? selectedHall.name
    : selectedCompany
      ? selectedCompany.name
      : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-white font-normal h-9",
            !displayLabel && "text-muted-foreground"
          )}
        >
          {displayLabel ? (
            <span className="flex items-center gap-2 truncate">
              {selectedHall ? (
                <Store className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              ) : (
                <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate">{displayLabel}</span>
            </span>
          ) : (
            "法人名またはホール名を検索..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[460px] p-0" align="start">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "company" | "hall")}
        >
          <div className="border-b px-2 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="company" className="flex-1 gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                法人
              </TabsTrigger>
              <TabsTrigger value="hall" className="flex-1 gap-1.5">
                <Store className="h-3.5 w-3.5" />
                ホール
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="company" className="mt-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="法人名・法人コードで検索..."
                value={companyQuery}
                onValueChange={setCompanyQuery}
              />
              <CommandList>
                <CommandEmpty>該当する法人が見つかりません</CommandEmpty>
                <CommandGroup>
                  {filteredCompanies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={String(company.id)}
                      onSelect={() => handleSelectCompany(company)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            selectedCompany?.id === company.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm truncate">{company.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {company.companyId}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </TabsContent>

          <TabsContent value="hall" className="mt-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="ホール名で検索..."
                value={hallQuery}
                onValueChange={setHallQuery}
              />
              <CommandList>
                <CommandEmpty>該当するホールが見つかりません</CommandEmpty>
                <CommandGroup>
                  {filteredHalls.map((hall) => (
                    <CommandItem
                      key={hall.id}
                      value={String(hall.id)}
                      onSelect={() => handleSelectHall(hall)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            selectedHall?.id === hall.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm truncate">{hall.name}</span>
                          <span className="text-xs text-muted-foreground">
                            担当: {hall.salesPersonName}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
