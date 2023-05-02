import { useEffect, useState } from "react";
import { LIBS } from "../utils/constants";
import { loadScript } from "../utils/loadscript";
// import { sendLogs } from "../utils/sendlogs";
import { logValue } from "./debugger";

const LOG_RECEIVER_TAG = "Receiver";

class CastReceiver {
  constructor() {
    this.context = null;
    this.framework = null;
    this.init = this.init.bind(this);
    this.enableDebug = this.enableDebug.bind(this);
    this.loadInterpret = this.loadInterpret.bind(this);
    this.controlInterpret = this.controlInterpret.bind(this);
    this.setCallBackLoadRequest = this.setCallBackLoadRequest.bind(this);
    this.sessionStateInterpret = this.sessionStateInterpret.bind(this);
    this.loadScript();
    logValue("constructor: ");
  }

  loadScript() {
    loadScript(
      LIBS.cast,
      () => {
        loadScript(LIBS.debug, this.init, () => {});
      },
      () => {}
    );
  }

  enableDebug() {
    this.context.addEventListener(cast.framework.system.EventType.READY, () => {
      if (!this.castDebugLogger.debugOverlayElement_) {
        /**
         *  Enable debug logger and show a 'DEBUG MODE' tag at
         *  top left corner.
         */
        this.castDebugLogger.setEnabled(true);

        /**
         * Show debug overlay.
         */
        this.castDebugLogger.showDebugLogs(true);
      }
    });
    this.castDebugLogger.loggerLevelByEvents = {
      "cast.framework.events.category.CORE": cast.framework.LoggerLevel.INFO,
      "cast.framework.events.EventType.MEDIA_STATUS":
        cast.framework.LoggerLevel.DEBUG,
    };

    if (!this.castDebugLogger.loggerLevelByTags) {
      this.castDebugLogger.loggerLevelByTags = {};
    }

    /*
     * Set verbosity level for custom tag.
     * Enables log messages for error, warn, info and debug.
     */
    this.castDebugLogger.loggerLevelByTags[LOG_RECEIVER_TAG] =
      cast.framework.LoggerLevel.DEBUG;
  }

  init() {
    logValue("init: ");

    this.framework = cast.framework;
    // this.castDebugLogger = cast.debug.CastDebugLogger.getInstance();
    if (this.framework) {
      this.context = cast.framework.CastReceiverContext.getInstance();
      this.playerManager = this.context.getPlayerManager();
      this.loadInterpret();
      this.controlInterpret();
      this.context.start();
    }
  }

  setCallBackLoadRequest(callBack) {
    this.callBackLoadRequest = callBack;
  }

  loadInterpret() {
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.LOAD,
      (loadRequestData) => {
        // logValue("loadInterpret: load: " + JSON.stringify(loadRequestData));
        if (this.callBackLoadRequest) this.callBackLoadRequest(loadRequestData);
        return loadRequestData;
      }
    );
  }

  sessionStateInterpret() {
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.SESSION_STATE,
      (sessionState) => {
        logValue("sessionStateInterpret: SESSION_STATE: ");
        // if (
        //   this.callBackLoadRequest &&
        //   sessionState.sessionState.loadRequestData
        // )
        //   this.callBackLoadRequest(sessionState.sessionState.loadRequestData);
        return sessionState;
      }
    );
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.RESUME_SESSION,
      (resumeSessionRequest) => {
        logValue("sessionStateInterpret: RESUME_SESSION: ");
        // if (
        //   this.callBackLoadRequest &&
        //   resumeSessionRequest.sessionState.loadRequestData
        // )
        //   this.callBackLoadRequest(
        //     resumeSessionRequest.sessionState.loadRequestData
        //   );
        return resumeSessionRequest;
      }
    );
  }

  controlInterpret() {
    logValue("controlInterpret: ");
    this.playerManager.setSupportedMediaCommands(
      this.framework.messages.Command.SEEK |
        this.framework.messages.Command.PAUSE |
        this.framework.messages.Command.STREAM_MUTE |
        this.framework.messages.Command.STREAM_VOLUME
    );

    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.MEDIA_STATUS,
      (data) => {
        // logValue("controlInterpret: MEDIA_STATUS: " + data.playerState);
        // logValue("D: ", data.playerState);
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
            // logValue("D: ", data.playerState);
            // logValue("PLAYING: ");
            break;
        }
        return data;
      }
    );

    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.PAUSE,
      (data) => {
        logValue("controlInterpret: PAUSE: ");
        // logValue("controlInterpret: PAUSE: " + JSON.stringify(data));
        // sendLogs("PAUSE: " + JSON.stringify(data));
        // if (data.requestId && this.videoJsRef) this.videoJsRef.togglePlay(true);
        return data;
      }
    );
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.PLAY,
      (data) => {
        logValue("controlInterpret: PLAY: ");
        // sendLogs("PLAY: " + JSON.stringify(data));
        // if (data.requestId && this.videoJsRef)
        //   this.videoJsRef.togglePlay(false);
        return data;
      }
    );
  }
}

const castReceiver = new CastReceiver();

export const useCastReceiver = function () {
  const [videoSource, setVideoSource] = useState("");
  useEffect(() => {
    logValue("castReceiver: UE");
    castReceiver.setCallBackLoadRequest((loadRequest) => {
      logValue(
        "setCallBackLoadRequest: " +
          (loadRequest.media.contentUrl || loadRequest.media.contentId)
      );
      if (loadRequest) {
        setVideoSource(loadRequest);
      }
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

export const useMediaStatus = function () {
  const [mediaStatus, setMediaStatus] = useState("media");
  useEffect(() => {
    // castReceiver.setMediaStatus(setMediaStatus);
  }, []);
  return mediaStatus;
};
