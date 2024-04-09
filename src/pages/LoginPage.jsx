import "./LoginPage.scss";
import { getAcToken } from "../api/acApi";
import Logo from "../assets/images/Logo.svg";
import { useState, useEffect } from "react";
import { Carousel } from "../components/LoginCarousel";
import { useNavigate } from "react-router-dom";
import {
  getSpotifyUserProfile,
  getSpotifyAccessToken,
} from "../api/spotifyApi";
import { useAuth } from "../contexts/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL;
  const SCOPE = "user-read-private user-read-email";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

  const generateRandomString = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const STATS = generateRandomString(10);
  const spotifyLoginUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URL}&state=${STATS}`;

  // useEffect(() => {
  //   const hash = window.location.hash;
  //   let spotifyToken = window.localStorage.getItem("spotifyToken");
  //   if (!spotifyToken && hash) {
  //     spotifyToken = hash
  //       .substring(1)
  //       .split("&")
  //       .find((elem) => elem.startsWith("access_token"))
  //       .split("=")[1];
  //     window.location.hash = "";
  //     window.localStorage.setItem("spotifyToken", spotifyToken);
  //     getAcToken(spotifyToken).then((res) => {
  //       console.log(res.data);
  //       const acToken = res.data.token;
  //       console.log("acToken:", acToken);
  //     });
  //     getSpotifyUserProfile(spotifyToken);
  //     console.log("spotufy token:", spotifyToken);
  //   }
  //   if (spotifyToken) {
  //     setTimeout(() => {
  //       navigate("/home");
  //     }, 2000);
  //   }
  // }, [navigate]);

  useEffect(() => {
    const tokenUrl = new URL(window.location.href);
    const params = new URLSearchParams(tokenUrl.search);
    const code = params.get("code");

    if (code) {
      localStorage.setItem("code", code);
      navigate("/pending");
    }

    // const url = "http://localhost:3000/login";
    // if (window.location.href !== url) {
    //   const tokenUrl = new URL(window.location.href);
    //   const params = new URLSearchParams(tokenUrl.search);
    //   const code = params.get("code");
    //   if (code) {
    //     const fetch = async () => {
    //       const spotifyToken = await getSpotifyAccessToken(code);
    //       console.log(spotifyToken);
    //       if (spotifyToken) {
    //         console.log("1");
    //         navigate("/pending");
    //       }
    //     };
    //     fetch(code);
    //   }
    // }
    // const href = window.location.href;
    // const startIndex = href.indexOf("=") + 1;
    // const lastIndex = href.indexOf("&");
    // const code = href.slice(startIndex, lastIndex);
    // getSpotifyAccessToken(code).then((res) => {
    //   const spotifyToken = res;
    //   if (spotifyToken) {
    //     navigate("/pending");
    //   }
    // });
  },[]);

  const handleLogin = () => {
    window.location = spotifyLoginUrl;
    // const url = new URL(window.location.href);
    // const params = new URLSearchParams(url.search);
    // const code = params.get("code");
    // localStorage.setItem("code", code);

    // const spotifyUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=${RESPONSE_TYPE}`;

    // window.location.href = spotifyUrl;
  };

  return (
    <div className="container">
      <div className="left-container">
        <div className="login-container">
          <div className="logo-wrapper">
            <img className="logo" src={Logo} alt="Logo" />
            <span>Connecting Stories That Matter</span>
          </div>
          <button className="login-btn" type="button" onClick={handleLogin}>
            使用 SPOTIFY 帳號登入
          </button>
          <div className="signup">
            <span>沒有帳號嗎？</span>{" "}
            <a href="https://www.spotify.com/tw/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F%3F_authfailed%3D1">
              註冊帳號
            </a>
          </div>
        </div>
      </div>
      <div className="right-container">
        <Carousel />
      </div>
    </div>
  );
};

// const clientId = process.env.REACT_APP_CLIENT_ID"; // Spotify Client id

// const redirectUri = process.env.REACT_APP_REDIRECT_URL; // Adjust the redirect URI

// const scope = "user-read-private user-read-email"; // Adjust scope based on your needs
// // Generate a random state for security

// const generateRandomString = (length) => {
//   let result = "";
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// };

// const state = generateRandomString(10);

// useEffect(() => {
//   const href = window.location.href;
//   console.log(href);
//   const params = new URLSearchParams(href.split("?")[1]);
//   const code = params.get("code");
//   const state = params.get("state");

//   const exchangeCodeForToken = async (code) => {
//     const clientId = process.env.REACT_APP_CLIENT_ID";
//     const clientSecret = process.env.REACT_APP_CLIENT_SECRET";
//     const redirectUri = process.env.REACT_APP_REDIRECT_URL; // 與之前相同的重定向 URI
//     const tokenEndpoint = "https://accounts.spotify.com/api/token";

//     try {
//       const response = await axios.post(
//         tokenEndpoint,
//         new URLSearchParams({
//           grant_type: "authorization_code",
//           code: code,
//           redirect_uri: redirectUri,
//         }),
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
//           },
//         }
//       );
//       const accessToken = response.data.access_token;
//       const refreshToken = response.data.refresh_token;
//       localStorage.setItem("accessToken:", accessToken);
//       localStorage.setItem("refreshToken:", refreshToken);
//       console.log("accessToken:", accessToken);
//       console.log("refreshToken:", refreshToken);

//       // 在這裡，你可以將 accessToken 和 refreshToken 存儲在你的應用程式中，以供後續使用
//     } catch (error) {
//       console.error("Error exchanging code for token", error.res);
//     }
//   };
//   if (code) {
//     exchangeCodeForToken(code);
//   }
// }, []);

// const handleLogin = () => {
//   const spotifyLoginUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
//   window.location = spotifyLoginUrl;
//   console.log(window.location);
// };
