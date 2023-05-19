import React, { useEffect, useMemo, useState } from "react";
import { DebugWindow, logValue } from "./components/debugger";
import { castReceiver, useCastReceiver } from "./components/receiver";
import VideoJS from "./components/videojs";
import videojs from "video.js";
import VideoControls from "./components/controls";
require("!style-loader!css-loader!video.js/dist/video-js.css");

function Main() {
  const videoSource = useCastReceiver();

  const [isPLayerCreated, setIsPLayerCreated] = useState(false);

  useEffect(() => {
    logValue("Version: " + (typeof window !== "undefined" ? adValue : 0));
  }, []);

  useEffect(() => {
    if (isPLayerCreated) {
      logValue("loadMedia: " + isPLayerCreated);
      castReceiver.loadScript();
    }
  }, [isPLayerCreated]);

  useEffect(() => {
    console.log("media: ", videoSource);
    logValue("media: " + videoSource.url);
  }, [videoSource]);

  const videoJsOptions = useMemo(
    () => ({
      autoplay: true,
      // responsive: true,
      mute: true,
      // fluid: true,
      // sources: [
      //   {
      //     // poster:
      //     //   "https://mir-s3-cdn-cf.behance.net/projects/404/5ec7bd164133673.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png",
      //     type:
      //       "application/vnd.apple.mpegurl" ||
      //       "application/dash+xml" ||
      //       "video/mp4",
      //   },
      // ],
    }),
    []
  );

  const handlePlayerReady = (player) => {
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const VideoPLayer = (
    <VideoJS
      options={videoJsOptions}
      onReady={handlePlayerReady}
      videoSource={videoSource}
      onPLayerMounted={setIsPLayerCreated}
      isPLayerCreated={isPLayerCreated}
    />
  );

  return (
    <div style={{ background: "green" }}>
      {VideoPLayer}
      <VideoControls videoSource={videoSource} />
      {/* <DebugWindow /> */}
    </div>
  );
}

export default Main;
