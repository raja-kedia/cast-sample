export const loadScript = (url, resolve, reject) => {
  const head = document.getElementsByTagName("head")[0];

  const script = document.createElement("script");
  script.type = "text/javascript";

  script.onload = function () {
    console.log("Laoded script: ", url)
    resolve && resolve();
  };

  script.onerror = function () {
    console.log("error script: ", url)
    reject && reject();
  };

  url && (script.src = url);

  head.appendChild(script);
};
