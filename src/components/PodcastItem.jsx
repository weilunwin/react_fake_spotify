import "./PodcastItem.scss";
import { PodcastModal } from "./PodcastModal";
import { useData } from "../contexts/DataContext";
import { useModal } from "../contexts/ModalContext";
import { getShowEpisodes } from "../api/spotifyApi";
import { deleteFavorite, getAcUser } from "../api/acApi";
import Play from "../assets/images/Play.svg";
import Favoite from "../assets/images/Favorite.svg";
import unFavorite from "../assets/images/unFavorite.svg";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import Swal from "sweetalert2";

export const PodcastItem = ({ data }) => {
  const { setShowPodcastModal, showPodcastModal } = useModal();
  const { setShowsTargetId, setEpisodes } = useData();

  const handleOpenPodcastModal = async (e) => {
    const showId = e.target.id;
    const res = await getShowEpisodes(showId);
    setEpisodes(res);
    setShowsTargetId(showId);
    setShowPodcastModal(true);
  };

  const imageUrl = data.images?.[0]?.url;

  return (
    <div className="podcast-item" key={data.id} id={data.id}>
      <div className="podcast-img">
        <img src={imageUrl} alt="" />
      </div>
      <div className="podcast-footer">
        <p className="podcast-name">{data.name}</p>
        <p className="publisher">{data.publisher}</p>
        <button type="button" id={data.id} onClick={handleOpenPodcastModal}>
          更多
        </button>
      </div>
      <PodcastModal showModal={showPodcastModal} />
    </div>
  );
};

export const FavoritesItem = ({ item, setPlayerInfo }) => {
  const { acUser, setAcUser } = useAuth();
  const { userFavorites, setUserFavorites } = useData();

  useEffect(() => {
    setUserFavorites(acUser.favoriteEpisodeIds);
    return () => {};
  }, [acUser]);

  const handleDeleteFavorite = async (e) => {
    const episodeId = e.target.id;
    const { success } = await deleteFavorite(episodeId);
    if (success) {
      const res = await getAcUser();
      setAcUser(res);
      Swal.fire({
        position: "center",
        title: "移除喜愛成功！",
        timer: 1000,
        icon: "success",
        showConfirmButton: false,
      });
    }
  };

  const countTime = (duration) => {
    const ms = duration / 1000;
    const minutes = Math.floor(ms / 60);
    const seconds = Math.floor(ms % 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}小時${minutes}分${seconds}秒`;
  };

  const handlePlay = (e) => {
    setPlayerInfo(item);
  };

  return (
    <div className="favorite-item" key={item.id}>
      <div className="favorite-item-image">
        <img src={item?.images?.[0].url} alt="Image" />
      </div>
      <div className="favorite-item-info">
        <section>
          <p className="favorite-item-title">{item.name}</p>
          <img
            src={Favoite}
            alt="喜愛"
            id={item.id}
            onClick={handleDeleteFavorite}
          />
        </section>
        <p className="favorite-item-description">{item.description}</p>
        <div className="btn-wrapper">
          <img src={Play} alt="Play" id={item.id} onClick={handlePlay} />
          <p className="date">{item.release_date}</p>
          <p className="time">{countTime(item.duration_ms)}</p>
        </div>
      </div>
    </div>
  );
};
