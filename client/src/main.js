import React, { useEffect } from "react";
import { DebugWindow, logValue } from "./components/debugger";
import { castReceiver } from "./components/receiver";

// import styles from "./main.scss";

function Main() {
  useEffect(() => {
    logValue("Version: " + (typeof window !== "undefined" ? adValue : 0));
    castReceiver.loadScript();
  }, []);

  return (
    <>
      {/* <DebugWindow /> */}
      {/* <cast-media-player></cast-media-player> */}
    </>
  );
}

export default Main;
