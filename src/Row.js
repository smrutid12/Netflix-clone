import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import CloseIcon from "@mui/icons-material/Close";
// import Tooltip from "@mui/material/Tooltip";
const base_url = "http://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  // const [showError, setShowError] = useState();
  const [trailerUrl, setTrailerUrl] = useState();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    console.log(fetchUrl);
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  const handleClick = (movie) => {
    movieTrailer(null, { tmdbId: movie.id })
      .then((url) => {
        console.log("url is " + url);
        const urlParams = new URLSearchParams(new URL(url).search);
        console.log("urlParamsn" + urlParams);
        setTrailerUrl(urlParams.get("v"));
      })
      .catch((error) => setTrailerUrl("Error"));
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {/*Several row_posters  */}
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            alt={movie.name}
          />
        ))}
        {trailerUrl === "Error" && (
          console.log("Error")
          // <Tooltip title="Add" placement="bottom">
          //   {movies.map((movie) => (
          //     <img
          //       key={movie.id}
          //       onClick={() => handleClick(movie)}
          //       src={`${base_url}${
          //         isLargeRow ? movie.poster_path : movie.backdrop_path
          //       }`}
          //       className={`row__poster ${isLargeRow && "row__posterLarge"}`}
          //       alt={movie.name}
          //     />
          //   ))}
          // </Tooltip>
        )}
      </div>
      {trailerUrl && (
        <>
          <CloseIcon
            style={{ top: "0", float: "right", cursor: "pointer" }}
            onClick={() => {
              setTrailerUrl("");
            }}
          />
          <YouTube videoId={trailerUrl} opts={opts} />
        </>
      )}
    </div>
  );
}

export default Row;
