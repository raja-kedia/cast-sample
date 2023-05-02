import React, { useEffect, useState } from "react";
import { DebugWindow, logValue } from "./components/debugger";
import { useCastReceiver, useMediaStatus } from "./components/receiver";
// import { useCastReceiver } from './components/receiver';

import styles from "./main.scss";

function Main() {
  const [startMessage, setStartMessage] = useState("");
  const videoSource = useCastReceiver();
  const mediaStatus = useMediaStatus();

  const fetchInitialResponse = async () => {
    logValue("fetchInitialResponse: ");
    // const response = await fetch("/cast-sample/api/getdata");
    // const responsejson = await response.json();
    // // logValue("fetchedInitialResponse: error");
    // setStartMessage(responsejson["start-message"]);
  };

  useEffect(() => {
    fetchInitialResponse();

    logValue("videoSource: " + JSON.stringify(videoSource));
    logValue("Version: " + (typeof window !== "undefined" ? adValue : 0));
  }, []);

  return (
    <>
      {/* <div className={styles["container"]}>
        {startMessage} 12 {typeof window !== "undefined" ? adValue : 0}
        <br />
        <br />
        {JSON.stringify(videoSource)} <br />
        <br />
        <div style={{ color: "red" }}>{mediaStatus}</div>
      </div> */}
      <DebugWindow />
    </>
  );
}

export default Main;
