import { createContext, useContext, useState } from "react";

const defaultContext = {
  showEditModal: false,
  showPodcastModal: false,
  showSearchModal: false,
  title: null,
  listTargetId: "", //分類的Id
  selectItem: null, //分類的object資料
};

const ModalContext = createContext(defaultContext);
export const useModal = () => useContext(ModalContext);
export const ModalProvider = ({ children }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [title, setTitle] = useState(null);
  const [listTargetId, setListTargetId] = useState("");
  const [selectItem, setSelectItem] = useState(null);
  return (
    <ModalContext.Provider
      value={{
        showEditModal,
        setShowEditModal,
        showPodcastModal,
        setShowPodcastModal,
        showSearchModal,
        setShowSearchModal,
        title,
        setTitle,
        listTargetId,
        setListTargetId,
        selectItem,
        setSelectItem,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
