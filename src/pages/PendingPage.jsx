import "./PendingPage.scss";
import axios from "axios";
import { useEffect, useRef } from "react";
import { getAcToken } from "../api/acApi";
import {
  getSpotifyAccessToken,
  getSpotifyUserProfile,
} from "../api/spotifyApi";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cleanup } from "@testing-library/react";

export const PendingPage = () => {
  const navigate = useNavigate();
  const cache = useRef(null);
  const { getUsers } = useAuth();

  useEffect(() => {
    let ignore = false;
    async function fetchToken() {
      if (!cache.current) {
        cache.current = true;
        const spotifyToken = await getSpotifyAccessToken();
        const acToken = await getAcToken();
        if (spotifyToken && acToken) {
          navigate("/home");
        }
      }
    }
    fetchToken();
    return () => {
      ignore = true;
    };
    // const code = localStorage.getItem("code");
    //   const fetchToken = async (code) => {
    //     try {
    //       const spotifyToken = await getSpotifyAccessToken(code);
    //       if (spotifyToken) {
    //         await getUsers(spotifyToken);
    //         setTimeout(() => {
    //           navigate("/home");
    //         }, 1200);
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };
    //   fetchToken(code);
    //   return () => {
    //     cleanup();
    //   };
  }, []);

  return (
    <div className="background">
      <div className="loading">
        <div></div>
        <p>LOADING...</p>
      </div>
    </div>
  );
};
