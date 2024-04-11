import "./CategoriesItem.scss";
import Swal from "sweetalert2";
import clsx from "clsx";
import { useModal } from "../contexts/ModalContext";
import { deleteAcCategories, getAcCategories, getAcUser } from "../api/acApi";
import { useData } from "../contexts/DataContext";

export const CategoriesItem = ({ categories, onActive, openEditBox }) => {
  const {
    showEditModal,
    setShowEditModal,
    listTargetId,
    setListTargetId,
    setShowSearchModal,
  } = useModal();
  const { setCategories, setRender, setTargetItem } = useData();

  const openEditName = (e) => {
    setShowEditModal(true);
  };

  const openSearchShows = (e) => {
    setShowSearchModal(true);
  };

  const deleteCategory = async (e) => {
    const id = categories.id;
    const { success } = await deleteAcCategories(id);
    if (success) {
      setCategories((prev) => prev.filter((category) => category.id !== id));
      // const datas = await getAcCategories();
      // setCategories(
      //   datas.map((data) => ({
      //     ...data,
      //     isActive: false,
      //     isChecked: false,
      //   }))
      // );
      Swal.fire({
        position: "center",
        title: "刪除成功！",
        timer: 1000,
        icon: "success",
        showConfirmButton: false,
      });
      setTargetItem(null);
      return;
    }
  };

  return (
    <>
      <div
        className={clsx("item", { active: categories.isActive })}
        id={categories.id}
        key={categories.id}
        onClick={(e) => {
          onActive?.(e);
        }}
      >
        <label
          key={categories.id}
          id={categories.id}
          className="item-name"
          onClick={(e) => {
            onActive?.(e);
          }}
        >
          <p
            id={categories.id}
            onClick={(e) => {
              onActive?.(e);
            }}
          >
            {categories.name}
          </p>
        </label>
        {/* 編輯框 */}
        <nav className={clsx("nav", { ischecked: categories.isChecked })}>
          <ul className="nav-list">
            <li className="nav-item" id={listTargetId} onClick={openEditName}>
              <p
                className="nav-link"
                // className={clsx("nav-link", { isEdit: categories.isEdit })}
                id={listTargetId}
                // onClick={openEditName}
              >
                編輯名稱
              </p>
            </li>
            <li className="nav-item" id={listTargetId} onClick={deleteCategory}>
              <p
                className="nav-link"
                id={listTargetId}
                // onClick={deleteCategory}
              >
                刪除分類
              </p>
            </li>
            <li
              className="nav-item"
              id={listTargetId}
              onClick={openSearchShows}
            >
              <p
                className="nav-link"
                id={listTargetId}
                // onClick={openSearchShows}
              >
                新增 Podcast
              </p>
            </li>
          </ul>
        </nav>
        <label
          htmlFor="navbar-toggle"
          className="toggle-wrapper"
          id={categories.id}
          onClick={openEditBox}
        >
          <span className="hamburger" id={categories.id}></span>
        </label>
      </div>
    </>
  );
};
