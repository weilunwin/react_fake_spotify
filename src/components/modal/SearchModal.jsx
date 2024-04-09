import "./SearchModal.scss";
import searchimge from "../../assets/images/Search.svg";
import FackImage from "../../assets/images/FakeImage.svg";
import Swal from "sweetalert2";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { getShows, searchShows } from "../../api/spotifyApi";
import { useData } from "../../contexts/DataContext";
import { useModal } from "../../contexts/ModalContext";
import { addShowInCategory, getAcCategories } from "../../api/acApi";

export const SearchModal = () => {
  const { showSearchModal, setShowSearchModal, listTargetId } = useModal();
  const {
    shows,
    setShows,
    showsTargetId,
    setShowsTargetId,
    categories,
    setCategories,
    targetItem,
    setTargetItem,
  } = useData();
  const [searchInput, setSearchInput] = useState("");
  const [searchShowsData, setSearchShowsData] = useState([]);

  useEffect(() => {
    const filterItem = categories.filter((categorie) => {
      return categorie.id === listTargetId;
    });

    setTargetItem(...filterItem);
  }, [categories]);

  useEffect(() => {
    setSearchShowsData((prevData) => {
      return prevData.map((data) => {
        if (data.id === showsTargetId) {
          return { ...data, isActived: true };
        }
        return { ...data, isActived: false };
      });
    });
  }, [showsTargetId]);

  const handleClose = (e) => {
    setSearchInput("");
    setShowSearchModal(false);
    setShowsTargetId([]);
  };

  const handleSearchInput = (e) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
  };
  const handleSearchEpisodes = async (e) => {
    if (searchInput.length === 0) return;
    const res = await searchShows(searchInput);
    const showData = res.shows.items;
    setSearchShowsData(showData);
  };
  const handleTargetId = (e) => {
    const id = e.target.id;
    setShowsTargetId(id);
  };

  const handelAddInCategory = async () => {
    if (showsTargetId.length === 0) return;
    try {
      const res = await addShowInCategory(listTargetId, showsTargetId);
      const success = res?.data?.success;
      if (success) {
        const categoriesData = await getAcCategories();
        setCategories(
          categoriesData.map((categorie) => {
            return {
              ...categorie,
              isActive: categorie.id === targetItem.id,
              isChecked: false,
              text: "O",
            };
          })
        );

        // const showsDataIds = targetItem.savedShows.map((item) => {
        //   return item.id;
        // });
        // const showsData = await Promise.all(
        //   showsDataIds.map(async (item) => {
        //     const res = await getShows(item);
        //     return res;
        //   })
        // );
        // setShows(showsData);
        setSearchInput("");
        setSearchShowsData([]);
        setShowSearchModal(false);
        setShowsTargetId([]);
        Swal.fire({
          position: "top",
          title: "新增成功！",
          timer: 1000,
          icon: "success",
          showConfirmButton: false,
        });
      }
      if (res === 409) {
        Swal.fire({
          position: "top",
          title: "已在清單內！",
          timer: 1000,
          icon: "warning",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div
      className={clsx("search-modal-container", { showModal: showSearchModal })}
    >
      <div className="search-modal">
        <div className="header">
          <p>新增Podcast</p>
          <p className="close" onClick={handleClose}>
            X
          </p>
        </div>
        <div className="search-input-wrapper">
          <button type="button" onClick={handleSearchEpisodes}>
            {" "}
            <img src={searchimge} alt="search" />
          </button>
          <input
            type="text"
            placeholder="開始搜尋..."
            value={searchInput}
            onChange={handleSearchInput}
            className="search-input"
          />
        </div>
        <p>搜尋結果</p>
        <div className="content">
          {searchShowsData.map((show) => {
            return (
              <div
                className={clsx("podcast-item", { isActived: show.isActived })}
                key={show.id}
                id={show.id}
                onClick={handleTargetId}
              >
                <img src={show.images[1].url} alt="image" id={show.id} />
                <p className="name" id={show.id}>
                  {show.name}
                </p>
                <p className="description" id={show.id}>
                  {show.description}
                </p>
              </div>
            );
          })}
          {/* <div className="podcast-item">
        <img src={FackImage} alt="" />
        <p>name</p>
        <p>description</p>
      </div> */}
        </div>
        <div className="footer">
          <button className="close" type="button" onClick={handleClose}>
            取消
          </button>
          <button className="add" type="button" onClick={handelAddInCategory}>
            確認新增
          </button>
        </div>
      </div>
    </div>
  );
};
