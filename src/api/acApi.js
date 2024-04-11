import axios from "axios";

const BASE_URL = "https://spotify-backend.alphacamp.io";

//取得AC Token
export const getAcToken = async () => {
  const token = localStorage.getItem("spotifyToken");
  try {
    const res = await axios.post(`${BASE_URL}/api/users`, {
      spotifyToken: token,
    });
    const acToken = res.data.token;
    localStorage.setItem("acToken", acToken);
    return { acToken, ...res.data };
  } catch (error) {
    console.error("[getAcToken Failed]:", error);
  }
};

//取得ac user
export const getAcUser = async () => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };
  try {
    const res = await axios.get(`${BASE_URL}/api/me`, config);
    return res.data;
  } catch (error) {
    console.error("[getAcUser Failed]:", error);
  }
};

//將episode儲存到收藏夾
export const addFavorite = async (episodeId) => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };
  const bodyParam = { episodeId: episodeId };
  try {
    const res = await axios.post(`${BASE_URL}/api/episodes`, bodyParam, config);
    return res.data;
  } catch (error) {
    console.error("[addCollection Failed]:", error);
  }
};

//從收藏夾刪除episode
export const deleteFavorite = async (episodeId) => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };

  try {
    const { data } = await axios.delete(
      `${BASE_URL}/api/episodes/${episodeId}`,
      config
    );
    return data;
  } catch (error) {
    console.error("[deleteFavorite Failed]:", error);
  }
};

//取得user分類
export const getAcCategories = async () => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };
  try {
    const res = await axios.get(`${BASE_URL}/api/categories`, config);
    const categories = res.data.categories;
    return categories;
  } catch (error) {
    console.error("[getCategories Failed]:", error);
  }
};

//建立user分類
export const setAcUserCategories = async (categoriesName) => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };
  const bodyParam = { name: categoriesName };
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/categories`,
      bodyParam,
      config
    );
    return data;
  } catch (error) {
    console.error("[setAcUserCategories Failed]:", error);
  }
};

//更新類別名稱
export const changeAcCategoriesName = async ({ categoryId, categoryName }) => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };
  const bodyParam = { name: categoryName };
  try {
    const { data } = await axios.put(
      `${BASE_URL}/api/categories/${categoryId}`,
      bodyParam,
      config
    );
    return data.success;
  } catch (error) {
    console.error("[changeAcCategoriesName Failed]:", error);
  }
};

//刪除類別
export const deleteAcCategories = async (categoryId) => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/api/categories/${categoryId}`,
      config
    );
    return data;
  } catch (error) {
    console.error("[deleteAcCategories Failed]:", error);
  }
};

//將show加入類別
export const addShowInCategory = async (categoryId, showId) => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };
  const params = { showId: showId };
  try {
    const res = await axios.post(
      `${BASE_URL}/api/categories/${categoryId}/shows`,
      params,
      config
    );
    console.log("add show in category success", res);
    return res;
  } catch (error) {
    console.error("[addShowInCategory is Failed]:", error);
    return error.response.status;
  }
};

//從類別刪除節目
export const deleteShowFromCategories = async ({ categoryId, showId }) => {
  const acToken = localStorage.getItem("acToken");
  const config = { headers: { Authorization: `Bearer ${acToken}` } };
  console.log(categoryId, showId);
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/api/categories/${categoryId}/shows/${showId}`,
      config
    );
    return data;
  } catch (error) {
    console.error("[deleteShowFromCatrgories Failed]", error);
  }
};
