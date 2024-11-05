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

  };

  return (<AuthContext.Provider value={{token, saveToken, removeToken}}>{children}</AuthContext.Provider>);

}


// interface AppContextType {
// events: Event[];
// setExpenses: React.Dispatch<React.SetStateAction<Event[]>>;
// user: User;
// setUser: React.Dispatch<React.SetStateAction<User>>;
// RSVPs : RSVP;

// budget: number;
// setBudget:React.Dispatch<React.SetStateAction<number>> ;
// }

// const initialState: AppContextType = {
// events: [],
// setExpenses: () => {},
// budget: 1000,
// setBudget: ()=>{},
// };

// export const AppContext = createContext<AppContextType>(initialState);

// export const AppProvider = (props: any) => {
// const [events, setEvents] = useState<Event[]>(initialState.events);
// const [budget, setBudget] = useState<number>(initialState.budget);
// return (
//   <AppContext.Provider
//     value={{
//       expenses: expenses,
//       setExpenses: setExpenses,
//       budget: budget,
//       setBudget: setBudget,
//     }}
//   >
//     {props.children}
//   </AppContext.Provider>
// );
// };