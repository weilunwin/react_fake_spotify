import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const defaultAuthContext = {
  currentUser: null, //當前使用者
  login: null,
  spotifyUser: null,
  acUser: null,
  isAuthenticated: false,
};
const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [acUser, setAcUser] = useState([]);
  const [spotifyUser, setSpotifyUser] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { pathname } = useLocation();


  return (
    <AuthContext.Provider
      value={{
        acUser,
        setAcUser,
        spotifyUser,
        setSpotifyUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
