import React, { useEffect } from "react";
import { DebugWindow, logValue } from "./components/debugger";
import { castReceiver } from "./components/receiver";

// import styles from "./main.scss";

function Main() {
  useEffect(() => {
    logValue("Version: " + (typeof window !== "undefined" ? adValue : 0));
  }, []);

  useEffect(() => {
    const mediaPlayer = document.createElement("cast-media-player");
    document.body.appendChild(mediaPlayer);
    castReceiver.loadScript();
  }, []);

  return null;
}

export default Main;
