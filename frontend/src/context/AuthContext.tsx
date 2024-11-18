import { createContext, useState, useEffect, ReactNode } from "react";
import {Event,Club,User,RSVP} from "../types/types";

// Exercise: Create add budget to the context

interface AuthContextType {
  token: string;
  saveToken: (jwt: string) => void;
  removeToken: () => void;
}

const defaultContextValue: AuthContextType = {
  token: "",
  saveToken: () => {},
  removeToken: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token,setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (jwt: string) => {
    localStorage.setItem("token", jwt);
  };

  const removeToken = () => {
    setToken(""); // Reset the token state
  };

  return (<AuthContext.Provider value={{token, saveToken, removeToken}}>{children}</AuthContext.Provider>);

}
