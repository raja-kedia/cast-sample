export const loadScript = (url, resolve, reject) => {
  const head = document.getElementsByTagName("head")[0];

  const script = document.createElement("script");
  script.type = "text/javascript";

  script.onload = function () {
    console.log("Laoded script: ", url);
    resolve && resolve();
  };

  script.onerror = function () {
    console.log("error script: ", url);
    reject && reject();
  };

  url && (script.src = url);

  head.appendChild(script);
};
export const loadScript2 = ({
  url,
  callback,
  inline,
  parent,
  async = true,
  defer = true,
  onError,
  insertOnTop,
}) => {
  try {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = async;
    script.defer = defer;
    const parentElement = parent || document.getElementsByTagName("head")[0];
    if (typeof script.onload !== "undefined") {
      // Others
      script.onload = function () {
        callback && callback();
      };
    } else if (
      typeof script.readyState !== "undefined" &&
      typeof script.onreadystatechange !== "undefined"
    ) {
      // For IE
      script.onreadystatechange = function () {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          callback && callback();
        }
      };
    }
    script.onerror = (error) => {
      onError && onError(error);
    };
    url && (script.src = url);
    inline && (script.innerHTML = inline);
    if (insertOnTop) {
      parentElement.insertBefore(script, parentElement.firstChild);
    } else {
      parentElement.appendChild(script);
    }
  } catch (error) {
    onError && onError(error);
  }
};
