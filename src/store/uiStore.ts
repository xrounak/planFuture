import { create } from 'zustand'
import { addDays } from 'date-fns'

interface UiState {
  isTaskFormOpen: boolean
  isBulkFormOpen: boolean
  activeDate: Date
  setTaskFormOpen: (open: boolean) => void
  setBulkFormOpen: (open: boolean) => void
  setActiveDate: (date: Date) => void
}

export const useUiStore = create<UiState>((set) => {
  // If it's past 6 PM, user probably wants to plan for tomorrow
  const currentlyPast6PM = new Date().getHours() >= 18;
  const defaultDate = currentlyPast6PM ? addDays(new Date(), 1) : new Date();

  return {
    isTaskFormOpen: false,
    isBulkFormOpen: false,
    activeDate: defaultDate,
    setTaskFormOpen: (open) => set({ isTaskFormOpen: open }),
    setBulkFormOpen: (open) => set({ isBulkFormOpen: open }),
    setActiveDate: (date) => set({ activeDate: date }),
  }
})
