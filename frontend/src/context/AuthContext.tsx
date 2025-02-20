import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextProps = {
  loggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  loggedIn: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (newUser: User, newToken: string) => {
    setLoggedIn(true);
    setUser(newUser);
    setToken(newToken);

    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setLoggedIn(false);
    setUser(null);
    setToken(null);

    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
