import Axios from "axios";

const isClientSide = typeof window !== "undefined";

const URL = "https://362d-110-173-180-18.ngrok.io/api";

export function sendLogs(log) {
  // Keeping comments to help debug
  if (isClientSide) {
    Axios.post(
      URL,
      { log },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    ).catch((err) => {
      console.log("Err: ", err, log);
    });
  }
}
