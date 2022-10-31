import React, { useState, useEffect } from "react";
import axios from "./axios";
import requests from "./requests";
import "./Banner.css";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";
import CloseIcon from "@mui/icons-material/Close";

function Banner() {
  const [movie, setMovie] = useState();
  const [show, setShow] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests?.fetchTopRated && requests?.fetchDocumentaries &&requests?.fetchRomanceMovies && requests?.fetchComedyMovies &&requests?.fetchActionMovies );
      console.log(request)
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
    }
    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + " ..." : str;
  }

  const handleClick = () => {
    movieTrailer(null, { tmdbId: movie.id })
      .then((url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
      })
      .catch((error) => console.log(error));
  };
  const opts = {
    height: "440",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  return (
    <>
      {" "}
      {show === false && (
        <header
          className="banner"
          style={{
            backgroundSize: "cover",
            backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
            backgroundPosition: "center center",
          }}
        >
          <div className="banner__contents">
            {/* title */}
            <h1 className="banner__title">
              {movie?.title || movie?.name || movie?.original_name}
            </h1>
            <div className="banner__buttons">
              <button
                className="banner__button"
                onClick={() => {
                  setShow(true);
                  handleClick();
                }}
              >
                Play
              </button>
              <button className="banner__button">My List</button>
            </div>
            <h1 className="banner__description">
              {truncate(movie?.overview, 150)}
            </h1>
          </div>
          {/* shading effect on the banner */}
          <div className="banner--fadeButton" />
        </header>
      )}
      {show === true && (
        <header
          className="banner"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          {trailerUrl && (
            <>
              <CloseIcon
                style={{
                  position: "fixed",
                  button: "50%",
                  zIndex:"1",
                  left: "50%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setTrailerUrl("");
                  setShow(false);
                }}
              />
              <YouTube videoId={trailerUrl} opts={opts} />
            </>
          )}
        </header>
      )}
    </>
  );
}

export default Banner;
