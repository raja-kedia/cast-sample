import React, { useCallback, useEffect } from "react";
import videojs from "video.js";
// import "video.js/dist/video-js.css";
import styles from "./debugger.scss";
import { logValue } from "./debugger";
import { createPortal } from "react-dom";
import { controlsSubscription } from "./controls";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady, src, onPLayerMounted, isPLayerCreated } = props;

  const createPlayer = useCallback(() => {
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoElement.classList.add("castMediaElement");
      videoElement.classList.add("videoStyle");
      videoElement.onplay = () => {
        logValue("onplay: ");
        controlsSubscription.emit("play", true);
      };
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        logValue("player is ready");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    }
  }, [playerRef.current, options]);

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    logValue("is PLayer crrwted: ", isPLayerCreated);
    if (!isPLayerCreated) {
      logValue("create PLayer: ");
      createPlayer();
      onPLayerMounted(true);
    }
  }, [options, videoRef, isPLayerCreated]);

  useEffect(() => {
    if (src) {
      logValue("update url: ", src);
      const player = playerRef.current;
      player.autoplay(true);
      player.src(src);
      player.muted(true);
    }
  }, [src]);

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

  const VideoPLayer = createPortal(
    <div ref={videoRef} style={{ width: "50%" }}></div>,
    document.body
  );

  return (
    <div data-vjs-player className={styles["vjs-container"]}>
      {VideoPLayer}
    </div>
  );
};

export default VideoJS;
