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
    const tokenUrl = new URL(window.location.href);
    const params = new URLSearchParams(tokenUrl.search);
    const code = params.get("code");
    if (code) {
      localStorage.setItem("code", code);
    }
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
