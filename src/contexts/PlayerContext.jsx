import { createContext, useContext, useState } from "react";

const defaultPlayerContext = {
  playerInfo: null, //取得episodeId
};
const playerInfoContext = createContext(defaultPlayerContext);
export const usePlayerInfo = () => useContext(playerInfoContext);

export const SpotifyProvider = ({ children }) => {
  const [playerInfo, setPlayerInfo] = useState(null);

  return (
    <playerInfoContext.Provider value={{ playerInfo, setPlayerInfo }}>
      {children}
    </playerInfoContext.Provider>
  );
};
