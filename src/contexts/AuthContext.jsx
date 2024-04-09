import { createContext, useContext, useState } from "react";
import { getAcToken } from "../api/acApi";
import { useLocation } from "react-router-dom";
import { getSpotifyUserProfile } from "../api/spotifyApi";

const defaultAuthContext = {
  currentUser: null, //當前使用者
  login: null,
  spotifyUser: null,
  acUser: null,
};
const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [acUser, setAcUser] = useState([]);
  const [spotifyUser, setSpotifyUser] = useState([]);

  return (
    <AuthContext.Provider
      value={{
        acUser,
        setAcUser,
        spotifyUser,
        setSpotifyUser,
        // getUsers: async () => {
        //   const { acToken, favoriteEpisodeIds, id } = await getAcToken(
        //   );
        //   const spotifyUser = await getSpotifyUserProfile();
        //   if (acToken) {
        //     setAcUser({ favoriteEpisodeIds, id });
        //     setSpotifyUser(spotifyUser);
        //     return;
        //   } else {
        //     setSpotifyUser([]);
        //   }
        // },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
