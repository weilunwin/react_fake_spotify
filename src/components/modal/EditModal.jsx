import "./EditModal.scss";
import Swal from "sweetalert2";
import clsx from "clsx";
import EmojiPicker from "emoji-picker-react";
import { Emoji } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { useModal } from "../../contexts/ModalContext";
import {
  changeAcCategoriesName,
  getAcCategories,
  setAcUserCategories,
} from "../../api/acApi";

export const EditModal = ({ onChangeName, inputValue, setInputValue }) => {
  const { categories, setCategories } = useData();
  const [open, setOpen] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const {
    showEditModal,
    setShowEditModal,
    title,
    listTargetId,
    setListTargetId,
    selectItem,
    setSelectItem,
  } = useModal();

  useEffect(() => {
    const findItem =
      categories &&
      categories.filter((item) => {
        return item.id === listTargetId;
      });

    setSelectItem(...findItem);
  }, [categories, listTargetId, setSelectItem]);

  const handleClose = (e) => {
    setShowEditModal(false);
    // setListTargetId("");
    setInputValue("");
    setCategories(categories.map((item) => ({ ...item, isChecked: false })));
  };

  const handleSave = async (e) => {
    if (inputValue.length === 0) {
      return;
    }

    if (selectItem) {
      const categoryId = selectItem.id;
      const categoryName = inputValue;
      const success = await changeAcCategoriesName({
        categoryId,
        categoryName,
      });
      if (success) {
        const datas = await getAcCategories();
        setCategories(
          datas.map((data) => ({
            ...data,
            isActive: false,
            isChecked: false,
          }))
        );
        setInputValue("");
        setShowEditModal(false);
        setChosenEmoji(null);
        Swal.fire({
          position: "center",
          title: "更新成功！",
          timer: 1000,
          icon: "success",
          showConfirmButton: false,
        });
        return;
      }
    }

    if (selectItem === undefined) {
      const success = await setAcUserCategories(inputValue);
      if (success) {
        const datas = await getAcCategories();
        setCategories(
          datas.map((data) => ({
            ...data,
            isActive: false,
            isChecked: false,
          }))
        );
        setInputValue("");
        setShowEditModal(false);
        setChosenEmoji(null);
        Swal.fire({
          position: "center",
          title: "新增成功！",
          timer: 1000,
          icon: "success",
          showConfirmButton: false,
        });
        return;
      } else {
        Swal.fire({
          position: "center",
          title: "重複命名！",
          timer: 1000,
          icon: "warning",
          showConfirmButton: false,
        });
      }
    }
  };
  const handelEmoji = () => {
    setOpen(!open);
  };
  const handleEmojiSelect = (emoji) => {
    setChosenEmoji(emoji);
    setInputValue(emoji.emoji + inputValue);
  };

  if (selectItem) {
    return (
      <div className={clsx("edit-modal", { "show-edit-modal": showEditModal })}>
        <div className="edit-modal-wrapper">
          <div className="header">
            <p>{selectItem.name}</p>
            <p className="cancel" onClick={handleClose}>
              X
            </p>
          </div>
          <div className="edit-modal-content">
            <div className="input-content">
              <span className="emoji" onClick={handelEmoji}>
                {chosenEmoji ? chosenEmoji.emoji : `\u{1F60A}`}
              </span>
              <input
                id={listTargetId}
                placeholder={selectItem.name}
                value={inputValue}
                className="edit-input"
                type="text"
                onChange={(e) => onChangeName?.(e)}
              />
              <div className="emoji-content">
                <EmojiPicker
                  open={open}
                  onEmojiClick={handleEmojiSelect}
                  width={350}
                  height={400}
                />
              </div>
            </div>
          </div>
          <div className="button-container">
            <button className="cancel" type="button" onClick={handleClose}>
              取消
            </button>
            <button className="save" type="button" onClick={handleSave}>
              儲存
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={clsx("edit-modal", { "show-edit-modal": showEditModal })}>
      <div className="edit-modal-wrapper">
        <div className="header">
          <p>{title}</p>
          <p className="cancel" onClick={handleClose}>
            X
          </p>
        </div>
        <div className="edit-modal-content">
          <div className="input-content">
            <span className="emoji" onClick={handelEmoji}>
              {" "}
              {chosenEmoji ? chosenEmoji.emoji : `\u{1F60A}`}
            </span>
            <input
              id={listTargetId}
              placeholder={title}
              value={inputValue}
              className="edit-input"
              type="text"
              onChange={(e) => onChangeName?.(e)}
            />
            <div className="emoji-content">
              <EmojiPicker
                open={open}
                onEmojiClick={handleEmojiSelect}
                width={350}
                height={400}
              />
            </div>
          </div>
        </div>
        <div className="button-container">
          <button className="cancel" type="button" onClick={handleClose}>
            取消
          </button>
          <button className="save" type="button" onClick={handleSave}>
            儲存
          </button>
        </div>
      </div>
    </div>
  );
};
