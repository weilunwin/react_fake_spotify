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
  const REDIRECT_URL = "https://react-fake-spotify-beta.vercel.app/pending";
  const SCOPE = "user-read-private user-read-email";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  // http://localhost:3000/pending;
  // "https://react-fake-spotify-beta.vercel.app/login"
  // process.env.REACT_APP_REDIRECT_URL;
  // "https://react-fake-spotify-beta.vercel.app/pending";
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

  // useEffect(() => {
  //   const tokenUrl = new URL(window.location.href);
  //   const params = new URLSearchParams(tokenUrl.search);
  //   const code = params.get("code");

  //   if (code) {
  //     localStorage.setItem("code", code);
  //     navigate("/pending");
  //   }

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
  // }, []);

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
