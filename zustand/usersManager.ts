import type { User } from "firebase/auth";
import { create } from "zustand";

type UserStore = {
    user : User | null;
    setUser:(user:User | null )=>void;
}

const useAuthStore = create<UserStore>()(set =>({
    user:null,
    setUser: user => set({user}), 
    }));

export default useAuthStore;