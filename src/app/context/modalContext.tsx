"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface ModalContextType {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const modalContext = createContext<ModalContextType | undefined> (undefined);

export const ModalProvider = ({children}: {children: ReactNode}) => {
    
    const[isOpen, setIsOpen] = useState(false);

    return (
        <modalContext.Provider value={{isOpen, setIsOpen}}>
            {children}
        </modalContext.Provider>
    );

}