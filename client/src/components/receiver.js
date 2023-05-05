import { LIBS } from "../utils/constants";
import { loadScript } from "../utils/loadscript";
import { logValue } from "./debugger";

class CastReceiver {
  constructor() {
    this.context = null;
    this.framework = null;
    this.init = this.init.bind(this);
    this.setCallBackLoadRequest = this.setCallBackLoadRequest.bind(this);
    this.getVideoDetails = this.getVideoDetails.bind(this);
    this.loadScript = this.loadScript.bind(this);
  }

  loadScript() {
    loadScript(LIBS.cast, this.init, () => {});
  }

  init() {
    this.framework = cast.framework;
    logValue("loaded cast: " + !!this.framework);
    if (this.framework) {
      this.context = cast.framework.CastReceiverContext.getInstance();
      this.playerManager = this.context.getPlayerManager();
      this.getVideoDetails();
      this.context.start();
    }
  }

  getVideoDetails() {
    this.playerManager.setMessageInterceptor(
      this.framework.messages.MessageType.LOAD,
      (loadRequestData) => {
        logValue("Loaded Video: " + JSON.stringify(loadRequestData));
        if (this.callBackLoadRequest)
          this.callBackLoadRequest(loadRequestData?.media?.contentUrl);
        return loadRequestData;
      }
    );
  }

  setCallBackLoadRequest(callBack) {
    this.callBackLoadRequest = callBack;
  }
}

export const castReceiver = new CastReceiver();
