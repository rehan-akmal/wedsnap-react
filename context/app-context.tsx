"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AppContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  cityFilter: string
  setCityFilter: (city: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  return (
    <AppContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        cityFilter,
        setCityFilter,
        priceRange,
        setPriceRange,
        selectedCategories,
        setSelectedCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
