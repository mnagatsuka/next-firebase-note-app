import { create } from 'zustand'

interface ModalState {
  loginOpen: boolean
  signupOpen: boolean
  
  // Actions
  openLogin: () => void
  closeLogin: () => void
  openSignup: () => void
  closeSignup: () => void
  closeAll: () => void
  switchToLogin: () => void
  switchToSignup: () => void
}

export const useModalStore = create<ModalState>()((set) => ({
  loginOpen: false,
  signupOpen: false,

  openLogin: () => set({ loginOpen: true, signupOpen: false }),
  
  closeLogin: () => set({ loginOpen: false }),
  
  openSignup: () => set({ signupOpen: true, loginOpen: false }),
  
  closeSignup: () => set({ signupOpen: false }),
  
  closeAll: () => set({ loginOpen: false, signupOpen: false }),
  
  switchToLogin: () => set({ loginOpen: true, signupOpen: false }),
  
  switchToSignup: () => set({ signupOpen: true, loginOpen: false }),
}))