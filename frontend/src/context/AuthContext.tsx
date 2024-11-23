import { createContext, useState, useEffect, ReactNode } from "react";
import {Event,Club,User,RSVP} from "../types/types";

// Exercise: Create add budget to the context

interface AuthContextType {
  token: string;
  id: string;
  accountType: string;
  saveToken: (jwt: string) => void;
  setAccountType: (type: string) => void;
  setId: (type: string) => void;
  removeToken: () => void;
}

const defaultContextValue: AuthContextType = {
  token: "",
  id: "",
  accountType: "",
  saveToken: () => {},
  setAccountType: () => {},
  setId: () => {},
  removeToken: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token,setToken] = useState("");
  const [accountType, setAccountType] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const removeToken = () => {
    setToken(""); // Reset the token state
  };

  return (<AuthContext.Provider value={{token, accountType, id, setId, setAccountType, saveToken, removeToken}}>{children}</AuthContext.Provider>);

}
