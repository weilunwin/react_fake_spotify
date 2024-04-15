import "./PodcastCollection.scss";
import Favorite from "../assets/images/Favorite.svg";
import unFavorite from "../assets/images/unFavorite.svg";
import Folder from "../assets/images/folder.svg";
import FakePlayerImage from "../assets/images/FakePlayerImage.svg";
import { PodcastItem, FavoritesItem } from "./PodcastItem";
import { SearchModal } from "./modal/SearchModal";
import { useState, useEffect } from "react";
import { useModal } from "../contexts/ModalContext";
import { useData } from "../contexts/DataContext";
import { usePlayerInfo } from "../contexts/PlayerContext";
import { getShows, getEpisode } from "../api/spotifyApi";
import { useAuth } from "../contexts/AuthContext";

export const PodcastCollection = () => {
  const {
    targetItem,
    setTargetItem,
    categories,
    shows,
    setShows,
    renderFavorite,
    userFavorites,
  } = useData();
  const { playerInfo, setPlayerInfo } = usePlayerInfo();
  const [userFavoriteEpisodesData, setUserFavoriteEpisodesData] = useState([]);

  //categories的savedShows資料
  useEffect(() => {
    const fetchShow = async () => {
      if (targetItem) {
        const ids = targetItem.savedShows.map((item) => {
          return item.id;
        });
        const showsData = await Promise.all(
          ids.map(async (item) => {
            const res = await getShows(item);
            return res;
          })
        );
        setShows(showsData);
      }
    };

    if (targetItem !== null) {
      fetchShow();
    }
  }, [targetItem]);

  //favorites的資料
  useEffect(() => {
    const favoriteIds = userFavorites?.map((item) => {
      return item.id;
    });
    const fetchFavoriteEpisode = async () => {
      try {
        const res = await getEpisode(favoriteIds);
        setUserFavoriteEpisodesData(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavoriteEpisode(favoriteIds);
  }, [renderFavorite, userFavorites]);


  return (
    <div className="collection">
      <div className="collection-wrapper">
        {targetItem !== null &&
        targetItem &&
        targetItem.savedShows &&
        targetItem.savedShows.length > 0
          ? shows.map((item) => {
              return <PodcastItem data={item} key={item.id} />;
            })
          : targetItem && (
              <CollectionBackground
                title={"您尚未加入任何 Podcast，可以點擊按鈕新增！"}
              />
            )}

        {renderFavorite && userFavorites.length === 0 && !targetItem ? (
          <CollectionBackground title={"您尚未加入任何收藏"} />
        ) : (
          renderFavorite &&
          userFavoriteEpisodesData?.map((item) => {
            return (
              <FavoritesItem
                item={item}
                key={item.id}
                setPlayerInfo={setPlayerInfo}
              />
            );
          })
        )}
      </div>
      <div className="music-listener">
        <div className="listener-container">
          <div className="listener-header">
            <p>正在播放</p>
          </div>
          <div className="listener-content">
            {!playerInfo ? (
              <p>
                Starting Your Own Podcast: Tips, Tricks, and Advice From Anchor
                Creators
              </p>
            ) : (
              <p>{playerInfo.name}</p>
            )}

            <div className="music-player">
              {playerInfo === null ? (
                <img src={FakePlayerImage} alt="Fake" />
              ) : (
                <iframe
                  src={
                    playerInfo
                      ? `https://open.spotify.com/embed/episode/${playerInfo.id}?utm_source=generator`
                      : null
                  }
                  width="100%"
                  height="380px"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollectionBackground = ({ title }) => {
  const { setShowSearchModal } = useModal();
  const { renderFavorite } = useData();
  const handleToggle = () => {
    setShowSearchModal(true);
  };

  return (
    <div className="collection-background">
      <div className="collection-bg-container">
        <img className="folder-img" src={Folder} alt="" />
        <p>{title}</p>
        {renderFavorite ? null : (
          <button
            className="create-podcast-btn"
            type="button"
            onClick={handleToggle}
          >
            新增 Podcast
          </button>
        )}
      </div>
      <SearchModal />
    </div>
  );
};
