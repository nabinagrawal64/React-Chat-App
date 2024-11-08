import { persist } from 'zustand/middleware';

export const createAuthSlice = persist(
    (set) => ({
        userInfo: {
            firstName: "",
            lastName: "",
            image: null,
            color: 0,
            profileSetup: false,
            email: "",
        },
        setUserInfo: (info) => set((state) => ({
            userInfo: { ...state.userInfo, ...info }
        })),
        logout: () => set({ userInfo: null }),
    }),
    {
        name: 'auth-storage',
        partialize: (state) => ({ userInfo: state.userInfo }), // Only save userInfo
    }
);
