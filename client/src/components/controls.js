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
  // const [currentTime, setCurrentTime] = React.useState(0);
  const [mute, setMute] = React.useState(INITIAL_MUTE_STATE);

  // const [isPaused, setIsPaused] = React.useState(false);
  useEffect(() => {
    controlsSubscription.subscribe("play", setIsPlaying);
    controlsSubscription.subscribe("startplay", setStartedPlaying);
    // controlsSubscription.subscribe("timeupdate", setCurrentTime);
    controlsSubscription.subscribe("mute", setMute);
    // controlsSubscription.subscribe("pause", setIsPaused);
  }, []);

  const style = isPlaying ? styles["play"] : styles["pause"];
  const backStyles = startedPlaying ? styles["back-play"] : styles["back-not"];
  return (
    <div className={styles["container"] + " " + backStyles}>
      <span>
        VideoControls PLaying: {`${isPlaying} ${startedPlaying} ${mute}`}
      </span>
      <br />
      <div className={style} />
    </div>
  );
}
