const CryptoJS = require("crypto-js");
export interface passwordObject {
  password: string;
  salt: string;
}

export const generatePassword = (
  email: string,
  password: string
): passwordObject => {
  const salt = CryptoJS.SHA256(email).toString();
  const crypt = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
  }).toString();

  return { password: crypt, salt: salt };
};

export const sha256 = (value: string) => {
  return CryptoJS.SHA256(value).toString();
};

export const encrypt = (value: string) => {
  return Buffer.from(value).toString("base64");
};

export const decrypt = (value: string) => {
  return Buffer.from(value, "base64").toString();
};

export const hashPassword = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32 }).toString();
};

export const convertObject = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};
