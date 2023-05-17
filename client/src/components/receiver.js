import { LIBS } from "../utils/constants";
import { loadScript2 } from "../utils/loadscript";
import { controlsSubscription } from "./controls";
import { logValue } from "./debugger";

class CastReceiver {
  constructor() {
    this.context = null;
    this.framework = null;
    this.init = this.init.bind(this);
    this.setCallBackLoadRequest = this.setCallBackLoadRequest.bind(this);
    this.getVideoDetails = this.getVideoDetails.bind(this);
    this.getControlDetails = this.getControlDetails.bind(this);
    this.loadScript = this.loadScript.bind(this);
    this.setMedia = null;
  }

  loadScript(setMedia) {
    this.setMedia = setMedia;
    loadScript2({
      url: LIBS.cast,
      callback: this.init,
    });
  }

  init() {
    this.framework = cast.framework;
    logValue("loaded cast: " + !!this.framework);
    if (this.framework) {
      this.context = cast.framework.CastReceiverContext.getInstance();
      logValue("loaded context: " + !!this.context);
      this.playerManager = this.context.getPlayerManager();
      this.getVideoDetails();
      this.getControlDetails();
      this.context.start();
    }
  }

  getVideoDetails() {
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.LOAD,
      (loadRequestData) => {
        logValue("Loaded Video: " + JSON.stringify(loadRequestData));
        this.setMedia(loadRequestData?.media?.contentId);
        if (this.callBackLoadRequest)
          this.callBackLoadRequest(loadRequestData?.media?.contentUrl);
        return loadRequestData;
      }
    );
  }

  getControlDetails() {
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.PAUSE,
      (data) => {
        // if (data.requestId && this.videoJsRef) this.videoJsRef.togglePlay(true);
        logValue("control Video: pause");
        controlsSubscription.emit("play", false);
        return data;
      }
    );
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.PLAY,
      (data) => {
        controlsSubscription.emit("play", true);
        // if (data.requestId && this.videoJsRef) this.videoJsRef.togglePlay(true);
        logValue("control Video: play");
        return data;
      }
    );
  }

  setCallBackLoadRequest(callBack) {
    this.callBackLoadRequest = callBack;
  }
}

export const castReceiver = new CastReceiver();
