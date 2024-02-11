import { Dispatch, SetStateAction, createContext } from "react";

export interface globalContextProps {
  fetchNotes: boolean;
  setFetchNotes: Dispatch<SetStateAction<boolean>>;
  fetchBoard: boolean;
  setFetchBoard: Dispatch<SetStateAction<boolean>>;
  fetchCategories: boolean;
  setFetchCategories: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<globalContextProps | undefined>(
  undefined
);
