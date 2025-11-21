import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create()(
    persist(
        (set, get) => ({
            profile: {
                id: "",
                name: "",
                lastName: "",
                email: "",
                age: "",
                password: "",
            },
            setProfile: (newProfile: any) => set({ profile: newProfile }),
        }),
        { name: "profile" }
    )
);
