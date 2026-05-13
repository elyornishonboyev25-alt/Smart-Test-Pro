import { create } from 'zustand'

export type RegisterModalState = {
    isOpen: boolean
    openRegisterModal: () => void
    closeRegisterModal: () => void
}

export const useRegisterModalStore = create<RegisterModalState>((
    set: (
        partial:
            | Partial<RegisterModalState>
            | ((state: RegisterModalState) => Partial<RegisterModalState>),
    ) => void,
) => ({
    isOpen: false,
    openRegisterModal: () => set({ isOpen: true }),
    closeRegisterModal: () => set({ isOpen: false }),
}))

