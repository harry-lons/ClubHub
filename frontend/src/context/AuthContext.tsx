import { createContext, useState, useEffect, ReactNode } from 'react';
import { Event, Club, User, RSVP } from '../types/types';
import Cookies from 'js-cookie';


interface AuthContextType {
  token: string;
  id: string;
  accountType: string;
  setToken: (jwt: string) => void;
  setAccountType: (type: string) => void;
  setId: (type: string) => void;
  removeToken: () => void;
  saveAuthenticationData: (
    jwt: string,
    accountType: string,
    id: string
  ) => void;
}

const defaultContextValue: AuthContextType = {
  token: '',
  id: '',
  accountType: '',
  setToken: () => { },
  setAccountType: () => { },
  setId: () => { },
  removeToken: () => { },
  saveAuthenticationData: () => { },
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState('');
  const [accountType, setAccountType] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    const storedToken = Cookies.get('token');
    const storedAccountType = Cookies.get('accountType');
    const storedId = Cookies.get('id');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedAccountType) {
      setAccountType(storedAccountType);
    }
    if (storedId) {
      setId(storedId);
    }
  }, []);

  let COOKIE_EXP_DAYS = 1;
  const saveAuthenticationData = (
    jwt: string,
    accountType: string,
    id: string
  ) => {
    Cookies.set('token', jwt, { expires: COOKIE_EXP_DAYS, secure: true });
    Cookies.set('accountType', accountType, {
      expires: COOKIE_EXP_DAYS,
      secure: true,
    });
    Cookies.set('id', id, { expires: COOKIE_EXP_DAYS, secure: true });
    setToken(jwt);
    setAccountType(accountType);
    setId(id);
  };

  const removeToken = () => {
    Cookies.remove('token');
    Cookies.remove('accountType');
    Cookies.remove('id');
    setToken('');
    setAccountType('');
    setId('');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        accountType,
        id,
        setId,
        setAccountType,
        setToken,
        removeToken,
        saveAuthenticationData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
