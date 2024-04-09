import "../components/PodcastModal.scss";
import Swal from "sweetalert2";
import unFavorite from "../assets/images/unFavorite.svg";
import Favorite from "../assets/images/Favorite.svg";
import Play from "../assets/images/Play.svg";
import clsx from "clsx";
import { useModal } from "../contexts/ModalContext";
import { useData } from "../contexts/DataContext";
import {
  addFavorite,
  deleteShowFromCategories,
  getAcCategories,
  getAcUser,
} from "../api/acApi";
import { getShows } from "../api/spotifyApi";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useReducer, useState } from "react";

export const PodcastModal = ({ showModal }) => {
  const { setShowPodcastModal } = useModal();
  const {
    setEpisodes,
    episodes,
    shows,
    setShows,
    showsTargetId,
    setShowsTargetId,
    targetItem,
    setTargetItem,
    setCategories,
    categories,
  } = useData();

  const handleClose = (e) => {
    setShowPodcastModal(false);
    setShowsTargetId(null);
  };

  const handleDeleteShows = async (e) => {
    const showId = e.target.id;
    const categoryId = targetItem.id;
    const res = await deleteShowFromCategories({ categoryId, showId });
    const success = res.success;
    if (success) {
      const categoriesData = await getAcCategories();
      setCategories(
        categoriesData.map((categoriesData) => ({
          ...categoriesData,
          isActive: categoriesData.id === targetItem.id,
          isChecked: false,
          text: "O",
        }))
      );
      setShowPodcastModal(false);
      Swal.fire({
        position: "center",
        title: "刪除成功！",
        timer: 1000,
        icon: "success",
        showConfirmButton: false,
      });
    }
  };

  const filterShow = shows.filter((show) => {
    return show.id === showsTargetId;
  });

  return (
    <div
      className={clsx("modal-container", {
        "show-podcast-modal": showModal,
      })}
    >
      <div className="podcast-modal">
        <div className="header">
          <div className="imgcontent">
            <img src={filterShow[0]?.images[0]?.url} alt="" />
          </div>
          <div className="podcast-info">
            <div className="title">
              <p>{filterShow[0]?.name}</p>
              <div className="close" onClick={handleClose}>
                X
              </div>
            </div>
            <div className="content">
              <section>
                <p>{filterShow[0]?.publisher}</p>
                <p>{filterShow[0]?.description}</p>
              </section>
              <div className="btn-wrapper">
                <button
                  type="button"
                  className="delete-btn"
                  id={filterShow[0]?.id}
                  onClick={handleDeleteShows}
                >
                  刪除
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-content">
          {episodes.map((episode) => {
            return <Podcast episode={episode} key={episode.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

//podcast modal裡的podcast
const Podcast = ({ episode }) => {
  const [iframeSrc, setIframeSrc] = useState("");
  const { episodes, setEpisodes, setUserFavorites, userFavorites } = useData();

  const { acUser, setAcUser } = useAuth();

  useEffect(() => {
    setUserFavorites(acUser.favoriteEpisodeIds);
  }, [acUser]);

  const handleAddFavorite = async (e) => {
    try {
      const res = await addFavorite(episode.id);
      const success = res.success;
      if (success) {
        const acUserRes = await getAcUser();
        setAcUser(acUserRes);
        Swal.fire({
          position: "center",
          title: "加入收藏成功！",
          timer: 1000,
          icon: "success",
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          position: "center",
          title: "已在收藏內！",
          timer: 1000,
          icon: "warning",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const userFavoriteIds = userFavorites.map((item) => {
    return item.id;
  });

  const setFavorite = userFavoriteIds.includes(episode.id);

  const handleFavoriteId = (e) => {
    console.log(e.target);
  };

  const countTime = (duration) => {
    const ms = duration / 1000;
    const minutes = Math.floor(ms / 60);
    const seconds = Math.floor(ms % 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}小時${minutes}分${seconds}秒`;
  };

  return (
    <div className="podcast" key={episode.id}>
      <div className="podcast-image">
        <img src={episode.images[0].url} alt="" />
      </div>
      <div className="podcast-info">
        <section>
          <p className="title">{episode.name}</p>
          <img
            src={setFavorite ? Favorite : unFavorite}
            alt="喜愛"
            id={episode.id}
            onClick={handleAddFavorite}
          />
        </section>
        <p className="info">{episode.description}</p>
        <div className="btn-wrapper">
          <img
            src={Play}
            alt="Play"
            id={episode.id}
            onClick={handleFavoriteId}
          />
          <p className="date">{episode.release_date}</p>
          <p className="duration">{countTime(episode.duration_ms)}</p>
        </div>
      </div>
    </div>
  );
};
