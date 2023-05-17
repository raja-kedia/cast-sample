import React, { useEffect } from "react";
import { INITIAL_MUTE_STATE } from "./constants";
import styles from "./controls.scss";
class ControlsSubscription {
  constructor() {
    this.isPLaying = false;
    this.startedPlaying = false;
    this.subscritionList = {};
  }

  subscribe = (key, callback) => {
    if (!this.subscritionList[key]) {
      this.subscritionList[key] = [];
    }
    this.subscritionList[key].push(callback);
  };

  emit = (key, data) => {
    if (this.subscritionList[key]) {
      this.subscritionList[key].forEach((callback) => {
        callback(data);
      });
    }
  };

  unsubscribe = (key) => {
    if (this.subscritionList[key]) {
      delete this.subscritionList[key];
    }
  };
}

export const controlsSubscription = new ControlsSubscription();

export default function VideoControls(props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [startedPlaying, setStartedPlaying] = React.useState(false);
  const [visibility, setVisibility] = React.useState(false);
  const visibilityTimeout = React.useRef(null);

  const [mute, setMute] = React.useState(INITIAL_MUTE_STATE);
  useEffect(() => {
    controlsSubscription.subscribe("play", setIsPlaying);
    controlsSubscription.subscribe("startplay", setStartedPlaying);

    controlsSubscription.subscribe("mute", setMute);
  }, []);

  useEffect(() => {
    setVisibility(true);
    if (isPlaying) {
      visibilityTimeout.current = setTimeout(() => {
        setVisibility(false);
      }, 3000);
    } else {
      clearTimeout(visibilityTimeout.current);
    }
  }, [isPlaying, startedPlaying, mute]);

  const style = isPlaying ? styles["pause"] : styles["play"];
  const backStyles = startedPlaying ? styles["back-play"] : styles["back-not"];
  return (
    <div className={styles["container"] + " " + backStyles}>
      {visibility ? (
        <div className={styles["title"]}>
          {props.videoSource.title || "Eng vs south africa"}
        </div>
      ) : null}

      {startedPlaying ? null : (
        <div className={styles["loading-container"]}>
          <span className={styles["loading"]} />
        </div>
      )}

      {startedPlaying && visibility ? <div className={style} /> : null}
    </div>
  );
}
