import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Function to store the user profile
 */
export const useUserStore = create<any>()(
    persist(
        (set) => ({
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
