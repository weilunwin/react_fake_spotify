import axios from "axios";

const BASE_URL = "https://api.spotify.com/v1";

//get spotify access token
export const getSpotifyAccessToken = async () => {
  console.log("success");
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const REDIRECT_URL = "https://react-fake-spotify-beta.vercel.app/pending";
  const code = localStorage.getItem("code");
  const url = "https://accounts.spotify.com/api/token";

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", REDIRECT_URL);

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
  };

  try {
    const res = await axios.post(url, params, { headers });
    const data = res.data;
    localStorage.setItem("spotifyToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    return data.access_token;
  } catch (error) {
    console.error("[getSpotifyAccessToken is Failed]:", error);
  }
};
//get refresh
export const getRefreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const url = "https://accounts.spotify.com/api/token";
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
    },
  };
  const bodyParameters = new URLSearchParams();
  bodyParameters.append("grant_type", "refresh_token");
  bodyParameters.append("refresh_token", refreshToken);

  try {
    const res = await axios.post(url, bodyParameters, config);
    localStorage.setItem("spotifyToken", res.data.access_token);

    console.log("refresh token success");
  } catch (error) {
    console.error("[getRefreshToken Failed]:", error);
  }
};

//獲取使用者資料
export const getSpotifyUserProfile = async () => {
  const spotifyToken = localStorage.getItem("spotifyToken");
  try {
    const res = await axios.get(`${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    const { display_name, images } = res.data;
    const userInfo = { name: display_name, images };

    return userInfo;
  } catch (error) {
    console.error("getSpotifyUserProfile Failed:", error);
    if (error.response.data.error.status === 401) {
      await getRefreshToken();
    } else {
      console.error("[getSpotifyUserProfile Failed]:", error);
    }
  }
};

//搜尋shows
export const searchShows = async (input) => {
  const spotifyToken = localStorage.getItem("spotifyToken");
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: { q: input, type: "show", limit: 20 },
      headers: { Authorization: `Bearer ${spotifyToken}` },
    });
    console.log("search Shows success");
    return res.data;
  } catch (error) {
    if (error.response.data.error.status === 401) {
      await getRefreshToken();
    } else {
      console.error("[searchShows is Failled]:", error);
    }
  }
};

export const getShows = async (showId) => {
  const spotifyToken = localStorage.getItem("spotifyToken");
  const config = {
    headers: { Authorization: `Bearer ${spotifyToken}` },
  };
  try {
    const { data } = await axios.get(`${BASE_URL}/shows/${showId}`, config);
    const { description, id, name, images, publisher, episodes } = data;
    const showData = {
      id,
      name,
      publisher,
      images,
      description,
      episodes,
    };
    return showData;
  } catch (error) {
    if (error.response.data.error.status === 401) {
      await getRefreshToken();
    } else {
      console.error("[getShows is Failed]:", error);
    }
  }
};

//取得show的節目集
export const getShowEpisodes = async (showId) => {
  const spotifyToken = localStorage.getItem("spotifyToken");
  const config = { headers: { Authorization: `Bearer ${spotifyToken}` } };
  try {
    const { data } = await axios.get(
      `${BASE_URL}/shows/${showId}/episodes?limit=15`,
      config
    );
    const dataItems = data.items;
    const episodesData = dataItems.map((item) => {
      const { id, name, description, images, release_date, duration_ms, uri } =
        item;
      return {
        id,
        name,
        description,
        images,
        release_date,
        duration_ms,
        uri,
      };
    });
    return episodesData;
  } catch (error) {
    console.error("[getShowEposides Failed]:", error);
  }
};

export const getEpisode = async (episodeIds) => {
  const spotifyToken = localStorage.getItem("spotifyToken");
  const config = { headers: { Authorization: `Bearer ${spotifyToken}` } };
  try {
    const episodePromises = episodeIds.map(async (episodeId) => {
      const { data } = await axios.get(
        `${BASE_URL}/episodes/${episodeId}`,
        config
      );
      const { id, description, name, release_date, images, duration_ms, uri } =
        data;
      const episodeData = {
        id,
        name,
        description,
        images,
        release_date,
        duration_ms,
        uri,
      };
      return episodeData;
    });

    const episodes = await Promise.all(episodePromises);
    return episodes;
  } catch (error) {
    console.error("[getEpisode Failed]:", error);
  }
};
