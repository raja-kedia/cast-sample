import React, { useEffect } from "react";
import videojs from "video.js";
// import "video.js/dist/video-js.css";
import styles from "./debugger.scss";
import { logValue } from "./debugger";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoElement.classList.add("castMediaElement");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        logValue("player is ready");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      logValue("update url: ", options.sources);
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
      player.muted(true);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useEffect(() => {
    const player = playerRef.current;
    console.log("useEffect player", player);
    if (playerRef.current) {
      setTimeout(() => {
        console.log("useEffect player2: ", player);
        logValue("useEffect: player is play");
        player.play();
      }, 4000);
    }
  }, [playerRef]);

  return (
    <div data-vjs-player className={styles["vjs-container"]}>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
