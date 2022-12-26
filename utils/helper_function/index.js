import CryptoJS from "crypto-js";
export const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, "finlotax").toString();
};

export const decryptPassword = (password) => {
  // Decrypt
  var bytes = CryptoJS.AES.decrypt(password, "finlotax");
  return bytes.toString(CryptoJS.enc.Utf8);
};
