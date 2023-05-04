import React, { useEffect, useState } from "react";
import { DebugWindow, logValue } from "./components/debugger";
import { useCastReceiver } from "./components/receiver";
// import { useCastReceiver } from './components/receiver';

import styles from "./main.scss";

function Main() {
  // const [startMessage, setStartMessage] = useState("");
  const videoSource = useCastReceiver();

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
      <DebugWindow />
      {/* <cast-media-player></cast-media-player> */}
    </>
  );
}

export default Main;
