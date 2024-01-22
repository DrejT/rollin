import { Dispatch, SetStateAction, createContext } from "react";

export interface globalContextProps {
  fetchNotes: boolean;
  setFetchNotes: Dispatch<SetStateAction<boolean>>;
  fetchCategories: boolean;
  setfetchCategories: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<globalContextProps | undefined>(
  undefined
);
