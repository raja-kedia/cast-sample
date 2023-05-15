import React, { useEffect, useState } from "react";
import { DebugWindow, logValue } from "./components/debugger";
import { castReceiver } from "./components/receiver";
import { createPortal } from "react-dom";
import VideoJS from "./components/videojs";
import videojs from "video.js";
// import "video.js/dist/video-js.css";
require("!style-loader!css-loader!video.js/dist/video-js.css");

// import styles from "./main.scss";

function Main() {
  const [media, setMedia] = useState(
    "https://dai.google.com/linear/hls/event/kX6OHnNXRCCHWAlPXcNMaQ/master.m3u8?hdnea=exp=1684151062~acl=*~id=MacIntel_1cba8fcb-5809-46~data=MacIntel~hmac=6b5c48e8dbba5d559d24e99b71d3f00a98c7851f4c5ce21deaf97befdf654552&deviceId=MacIntel&advertiserId=undefined&cust_params=app_version%3D%26app_platform%3Dfc-web%26state%3DMaharashtra%26city%3DMumbai%26match_id%3D59460%26match_format%3DT10%26tour_id%3D2826%26tour_name%3DDream11_Trinidad_T10_Blast%26sport%3Dcricket%26authorizationType%3DNONE&state=Maharashtra&city=Mumbai"
  );
  useEffect(() => {
    logValue("Version: " + (typeof window !== "undefined" ? adValue : 0));
  }, []);

  useEffect(() => {
    // const mediaPlayer = document.createElement("cast-media-player");
    // document.body.appendChild(mediaPlayer);
    castReceiver.loadScript(setMedia);
  }, []);

  useEffect(() => { 
    console.log("media: ", media);
    logValue("media: " + media);
  }, [media]);

  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    mute: true,
    fluid: true,
    sources: [
      {
        src: media,
        type:
          "application/vnd.apple.mpegurl" ||
          "application/dash+xml" ||
          "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const VideoPLayer = (
    <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
  );

  return (
    <>
      <div> good </div>
      {VideoPLayer}
      <DebugWindow />
    </>
  );
}

export default Main;
