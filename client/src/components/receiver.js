import { useEffect, useState } from "react";
import { sendLogs } from "../utils/sendlogs";

const castDebugLogger = cast.debug.CastDebugLogger.getInstance();
const LOG_RECEIVER_TAG = "Receiver";

class CastReceiver {
  constructor() {
    this.context = null;
    this.framework = null;
    this.init = this.init.bind(this);
    this.enableDebug = this.enableDebug.bind(this);
    this.setCallBackLoadRequest = this.setCallBackLoadRequest.bind(this);
    this.init();
    // this.enableDebug();
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
    sendLogs("init: ");
    this.framework = cast.framework;
    if (this.framework) {
      this.context = cast.framework.CastReceiverContext.getInstance();
      this.playerManager = this.context.getPlayerManager();

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
      this.context.start();
    }
  }

  setCallBackLoadRequest(callBack) {
    this.callBackLoadRequest = callBack;
  }

  registerPlayer() {
    this.playerManager.setSupportedMediaCommands(
      this.framework.messages.Command.SEEK |
        this.framework.messages.Command.PAUSE |
        this.framework.messages.Command.STREAM_MUTE |
        this.framework.messages.Command.STREAM_VOLUME
    );

    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.MEDIA_STATUS,
      (data) => {
        switch (data.playerState) {
          case this.framework.messages.PlayerState.PLAYING:
            // const duration = this.videoJsRef?.player?.duration();
            // const isLive = this.videoJsRef?.player?.liveTracker.isLive();
            const info = this.playerManager?.getMediaInformation();
            // if (duration && info && !info.duration && !isLive) {
            //   this.playerManager?.setMediaInformation(
            //     Object.assign(info, { duration })
            //   );
            // }
            console.log("D: ", data.playerState);
            sendLogs("PLAYING: " + JSON.stringify(info));
            break;
        }
        return data;
      }
    );

    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.PAUSE,
      (data) => {
        sendLogs("PAUSE: " + JSON.stringify(data));
        // if (data.requestId && this.videoJsRef) this.videoJsRef.togglePlay(true);
        return data;
      }
    );
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.PLAY,
      (data) => {
        sendLogs("PLAY: " + JSON.stringify(data));
        // if (data.requestId && this.videoJsRef)
        //   this.videoJsRef.togglePlay(false);
        return data;
      }
    );
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
