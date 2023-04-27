import { useState } from "react";
import { sendLogs } from "../utils/sendlogs";

const castDebugLogger = cast.debug.CastDebugLogger.getInstance();
const LOG_RECEIVER_TAG = "Receiver";

class CastReceiver {
  constructor() {
    this.context = null;
    this.framework = null;
    this.init = this.init.bind(this);
    this.enableDebug = this.enableDebug.bind(this);
    this.setCallBackLoadRequest = this.init.setCallBackLoadRequest(this);
    this.enableDebug();
    this.init();
  }

  enableDebug() {
    this.context.addEventListener(cast.framework.system.EventType.READY, () => {
      if (!castDebugLogger.debugOverlayElement_) {
        /**
         *  Enable debug logger and show a 'DEBUG MODE' tag at
         *  top left corner.
         */
        castDebugLogger.setEnabled(true);

        /**
         * Show debug overlay.
         */
        castDebugLogger.showDebugLogs(true);
      }
    });
    castDebugLogger.loggerLevelByEvents = {
      "cast.framework.events.category.CORE": cast.framework.LoggerLevel.INFO,
      "cast.framework.events.EventType.MEDIA_STATUS":
        cast.framework.LoggerLevel.DEBUG,
    };

    if (!castDebugLogger.loggerLevelByTags) {
      castDebugLogger.loggerLevelByTags = {};
    }

    /*
     * Set verbosity level for custom tag.
     * Enables log messages for error, warn, info and debug.
     */
    castDebugLogger.loggerLevelByTags[LOG_RECEIVER_TAG] =
      cast.framework.LoggerLevel.DEBUG;
  }

  init() {
    this.framework = cast.framework;
    if (this.framework) {
      this.context = cast.framework.CastReceiverContext.getInstance();
      this.playerManager = context.getPlayerManager();

      this.playerManager.setMessageInterceptor(
        cast.framework.messages.MessageType.LOAD,
        (loadRequestData) => {
          sendLogs("loadRequestData: " + JSON.stringify(loadRequestData));
          castDebugLogger.debug(
            LOG_RECEIVER_TAG,
            `loadRequestData: ${JSON.stringify(loadRequestData)}`
          );
        }
      );
    }
  }

  setCallBackLoadRequest(callBack) {
    this.callBackLoadRequest = callBack;
  }
}

const castReceiver = new CastReceiver();

export const useCastReceiver = function () {
  const [videoSource] = useState("");
  sendLogs("useCastReceiver: " + JSON.stringify(videoSource));
  useEffect(() => {
    castReceiver.setCallBackLoadRequest((loadRequest) => {
      sendLogs("setCallBackLoadRequest: " + JSON.stringify(loadRequest));
      //   if (loadRequest.media.contentType) {
      //     setVideoSource({
      //       title:
      //         loadRequest.media.customData?.contentName ||
      //         loadRequest.media.customData?.title,
      //       description: loadRequest.media.customData?.contentName,
      //       posterUrl: loadRequest.media.customData?.posterUrl,
      //       url: loadRequest.media.contentUrl || loadRequest.media.contentId,
      //       playerType: FCGQL.VideoPlayerType.FANCODE,
      //       deliveryType: loadRequest.media.contentType,
      //       contextParams: loadRequest.media.customData,
      //       certificateUri: loadRequest.media.customData?.certificateUri,
      //       licenseUri: loadRequest.media.customData?.licenseUri,
      //     });
      //   }
    });
  }, []);
  return videoSource;
};
