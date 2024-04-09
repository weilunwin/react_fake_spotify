import { createContext, useContext, useState } from "react";

const defaultDataContext = {
  categories: null, //分類
  shows: [], //targetItem裡的shows
  showsTargetId: null, //search裡點選的show id
  targetItem: null, //點選的分類
  episodes: [], //shows裡的節目
  userFavorites: [],
  renderFavorite: false,
};

const DataContext = createContext(defaultDataContext);
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [shows, setShows] = useState([]);
  const [showsTargetId, setShowsTargetId] = useState([]);
  const [targetItem, setTargetItem] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [renderFavorite, setRenderFavorite] = useState(false);

  return (
    <DataContext.Provider
      value={{
        episodes,
        setEpisodes,
        categories,
        setCategories,
        shows,
        setShows,
        showsTargetId,
        setShowsTargetId,
        targetItem,
        setTargetItem,
        userFavorites,
        setUserFavorites,
        renderFavorite,
        setRenderFavorite,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
