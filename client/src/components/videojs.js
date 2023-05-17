import React, { useCallback, useEffect } from "react";
import videojs from "video.js";
// import "video.js/dist/video-js.css";
import styles from "./debugger.scss";
import { logValue } from "./debugger";
import { createPortal } from "react-dom";
import { controlsSubscription } from "./controls";
import { INITIAL_MUTE_STATE } from "./constants";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const [mute, setMute] = React.useState(INITIAL_MUTE_STATE);
  const { options, onReady, videoSource, onPLayerMounted, isPLayerCreated } =
    props;

  const createPlayer = useCallback(() => {
    if (!playerRef.current) {
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
        player.poster(
          "https://d37b8r5jwexjm9.cloudfront.net/wp-content/uploads/2022/06/26231835/fancodefinalbanner.jpg"
        );
        onReady && onReady(player);
      }));
    }
  }, [playerRef.current, options]);

  React.useEffect(() => {
    if (!isPLayerCreated) {
      createPlayer();
      onPLayerMounted(true);
    }
  }, [options, videoRef, isPLayerCreated]);

  useEffect(() => {
    if (videoSource.src) {
      logValue("update url: ", videoSource.src);
      const player = playerRef.current;
      player.autoplay(true);
      player.src({ src: videoSource.src });
      player.poster(videoSource?.posterUrl);
      player.muted(mute);
    }
  }, [videoSource]);

  useEffect(() => {
    logValue("mute: ", mute);
    const player = playerRef.current;
    player.muted(mute);
  }, [mute]);

  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  React.useEffect(() => {
    controlsSubscription.emit("mute", setMute);
  }, []);

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
