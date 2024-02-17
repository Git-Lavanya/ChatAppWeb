import cryptoJS from "crypto-js";

export var refreshToken = function (token) {
  const requestToken = token;
  return function () {
    return requestToken || "test";
  };
};
export var accessToken = "";
export const encryptPassword = (password) => {
  return cryptoJS.AES.encrypt(password, " ").toString();
};

export const decryptPassword = (password) => {
  // Decrypt
  var bytes = cryptoJS.AES.decrypt(password, " ");
  return bytes.toString(cryptoJS.enc.Utf8);
};

export const protectedRefreshToken = (token) => {
  if (token) {
    refreshToken(token);
  }
};
export const protectedAccessToken = (token) => {
  if (accessToken) {
    accessToken = (function () {
      var newToken = token;
      return function () {
        return newToken;
      };
    })();
  }
};
export function ScrollToBottom(callback) {
  const container = document.getElementById("srollable-chat-container");
  if (container) {
    callback && callback();
    container.scrollTop = container.scrollHeight;
    const lastElement = container.lastElementChild;
    if (lastElement) lastElement.scrollIntoView();
  }
}
