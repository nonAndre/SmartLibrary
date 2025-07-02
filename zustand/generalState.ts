import { create } from "zustand";

type Modal ={
    id: string;
    setId:(id:string)=>void;
    isOpen: boolean;
    setIsOpen:(isOpen:boolean)=>void;
     isGeminiOpen: boolean;
    setIsGeminiOpen:(isGeminiOpen:boolean)=>void;
}

const useGeneralStore = create<Modal>()(set=>({
    id:"",
    setId: id =>set({id}),
    isOpen:false,
    setIsOpen: isOpen => set({isOpen}),
    isGeminiOpen:false,
    setIsGeminiOpen:isGeminiOpen => set({isGeminiOpen})
    
}));

export default useGeneralStore;