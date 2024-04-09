import { createContext, useState } from "react";

const defaultIfarme = {
  
}
const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
  const [spotifyIframe, setSpotifyIframe] = useState(null);

  return (
    <SpotifyContext.Provider value={{ spotifyIframe, setSpotifyIframe }}>
      {children}
    </SpotifyContext.Provider>
  );
};
