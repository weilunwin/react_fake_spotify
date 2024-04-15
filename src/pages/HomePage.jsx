import "./HomePage.scss";
import logo from "../assets/images/Logo.svg";
import fakeUserImg from "../assets/images/FakeUserImg.png";
import { CategoriesItem } from "../components/CategoriesItem.jsx";
import { EditModal } from "../components/modal/EditModal.jsx";
import { PodcastCollection } from "../components/PodcastCollection";
import { useState, useEffect } from "react";
import { getSpotifyUserProfile } from "../api/spotifyApi.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  getAcCategories,
  getAcToken,
  getAcUser,
  setAcUserCategories,
} from "../api/acApi.js";
import { useData } from "../contexts/DataContext.jsx";
import { useModal } from "../contexts/ModalContext.jsx";
import { SearchModal } from "../components/modal/SearchModal.jsx";

export const HomePage = () => {
  const { acUser, setAcUser, spotifyUser, setSpotifyUser, isAuthenticated } =
    useAuth();
  const {
    categories,
    setCategories,
    shows,
    setShows,
    targetItem,
    setTargetItem,
    userFavorites,
    setUserFavorites,
    setRenderFavorite,
    renderFavorite,
  } = useData();
  const {
    showEditModal,
    setShowEditModal,
    title,
    setTitle,
    listTargetId,
    setListTargetId,
  } = useModal();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const spotifyUserRes = await getSpotifyUserProfile();
      if (spotifyUserRes) {
        setSpotifyUser(spotifyUserRes);
      }
      const acUserRes = await getAcUser();
      if (acUserRes) {
        setAcUser(acUserRes);
      }
      const categoriesData = await getAcCategories();
      if (categoriesData) {
        setCategories(
          categoriesData.map((data) => ({
            ...data,
            isActive: false,
            isChecked: false,
          }))
        );
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setUserFavorites(acUser.favoriteEpisodeIds);
    // setListTargetId("");
    if (renderFavorite) {
      setListTargetId("");
      setCategories((prevItems) => {
        return prevItems.map((item) => {
          return { ...item, isActive: false, isChecked: false };
        });
      });
    }
  }, [acUser, renderFavorite]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const spotifyImage =
    spotifyUser && spotifyUser.images && spotifyUser.images.length > 0
      ? spotifyUser.images[0].url
      : null;

  //顯示早午晚安
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "早安";
    } else if (hour >= 12 && hour < 18) {
      return "午安";
    } else {
      return "晚安";
    }
  };
  const greeting = getGreeting();

  //打開清單編輯
  const handleEditBox = (e) => {
    const id = e.target.id;
    setListTargetId(id);
    setCategories((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, isActive: true, isChecked: !item.isChecked };
        }
        return { ...item, isChecked: false };
      });
    });
  };
  //focus item
  const handleActive = (e) => {
    e.stopPropagation();
    const id = e.target.id;
    setListTargetId(id);
    setCategories((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, isActive: true };
        }
        return { ...item, isActive: false, isChecked: false };
      });
    });
    const selectedtItem = categories.filter((item) => {
      return item.id === id;
    });
    setTargetItem(...selectedtItem);
    setRenderFavorite(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  //新增分類
  const handleAddCategory = (e) => {
    e.stopPropagation();
    setShowEditModal(true);
    setTitle("新增分類");
    setListTargetId("");
    if (e.target.className === "cancel") {
      setShowEditModal(false);
    }
  };

  const handleInputValue = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleFavorite = (e) => {
    setRenderFavorite(true);
  };

  return (
    <div className="container">
      <div className="list-panel">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="item-wrapper">
          {categories !== null
            ? categories.map((item) => {
                return (
                  <CategoriesItem
                    key={item.id}
                    categories={item}
                    targetId={listTargetId}
                    openEditBox={handleEditBox}
                    onActive={handleActive}
                  />
                );
              })
            : null}
        </div>
        <div className="favorite" onClick={handleFavorite}>
          <p>❤️</p>
          <label>已收藏</label>
        </div>
        <div className="create-item" onClick={handleAddCategory}>
          <label>新增分類</label>
        </div>
      </div>
      <div className="podcast-container">
        <div className="header">
          <p>{greeting}</p>
          <div className="user-container">
            <img
              src={!spotifyImage && fakeUserImg}
              alt="user-img"
              className="user-image"
            />
            <p className="user-name">{spotifyUser.name}</p>
            <input
              type="checkbox"
              name=""
              id="user-operation"
              className="user-operation"
            />
            <nav className="user-nav">
              <ul className="user-nav-list">
                <li className="user-nav-item" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </nav>
            <label className="user-nav-label" htmlFor="user-operation">
              <span className="arrow"></span>
            </label>
          </div>
        </div>
        <PodcastCollection />
      </div>
      <EditModal
        onToggleEditBox={handleEditBox}
        onChangeName={handleInputValue}
        title={title}
        targetId={listTargetId}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <SearchModal />
    </div>
  );
};
