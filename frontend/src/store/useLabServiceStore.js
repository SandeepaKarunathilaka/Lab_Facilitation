import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  labServices: [],
  selectedLabService: null,
  isAddLabServiceModalOpen: false,
  isEditLabServiceModalOpen: false,
  isViewLabServiceModalOpen: false,
};

const store = (set) => ({
  ...initialState,
  setLabServices: (labServices) => set({ labServices }),
  setSelectedLabService: (labService) =>
    set({ selectedLabService: labService }),
  openAddLabServiceModal: () => set({ isAddLabServiceModalOpen: true }),
  closeAddLabServiceModal: () => set({ isAddLabServiceModalOpen: false }),
  openEditLabServiceModal: () => set({ isEditLabServiceModalOpen: true }),
  closeEditLabServiceModal: () => set({ isEditLabServiceModalOpen: false }),
  openViewLabServiceModal: () => set({ isViewLabServiceModalOpen: true }),
  closeViewLabServiceModal: () => set({ isViewLabServiceModalOpen: false }),
});

export const useLabServiceStore = create(devtools(store, "labServiceStore"));
