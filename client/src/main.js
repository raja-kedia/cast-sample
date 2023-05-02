import React, { useEffect, useState } from "react";
import { useCastReceiver, useMediaStatus } from "./components/receiver";
// import { useCastReceiver } from './components/receiver';

import styles from "./main.scss";

function Main() {
  const [startMessage, setStartMessage] = useState("");
  const videoSource = useCastReceiver();
  const mediaStatus = useMediaStatus();

  const fetchInitialResponse = async () => {
    const response = await fetch("/cast-sample/api/getdata");
    const responsejson = await response.json();
    setStartMessage(responsejson["start-message"]);
  };

  useEffect(() => {
    fetchInitialResponse();
  }, []);

  console.log("videoSource: ", videoSource);

  return (
    <div className={styles["container"]}>
      {startMessage} 12 {typeof window !== "undefined" ? adValue : 0}{" "}
      {JSON.stringify(videoSource)} <br />
      {mediaStatus}
    </div>
  );
}

export default Main;
