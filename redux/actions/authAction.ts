import { API_URL } from "../../utils/baseUrl";
import axios from "axios";
import { encryptPassword, decryptPassword } from "../../utils/helper_function";
import { createAsyncThunk } from "@reduxjs/toolkit";
import APIInstance from "../../utils/api_interceptor";
interface LoginRequestInput {
  username: string;
  password: string;
}
export const Axios = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
function profileConverter(data) {
  let image = "";
  if (data?.image) {
    let binaryDataString = data.image;
    const binaryData = new Uint8Array(binaryDataString.length);
    for (let i = 0; i < binaryDataString.length; i++) {
      binaryData[i] = binaryDataString.charCodeAt(i);
    }
    const arrayBuffer = binaryData.buffer;
    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
    const blobUrl = URL.createObjectURL(blob);
    image = blobUrl;
  }
  return {
    image,
    contentType: data?.contentType?.split(".")?.[0] || "",
  };
}
export const getAuthentication = async (requestInput: LoginRequestInput) => {
  try {
    requestInput.password = encryptPassword(requestInput?.password || "");
    const res = await Axios.post(`api/auth/login`, requestInput);
    if (res.status === 200) {
      const {
        data: { data },
      } = res;
      // protectedRefreshToken(data?.data?.refreshToken);
      localStorage.setItem("refreshToken", res.data?.data?.refreshToken);
      return data?.profile_pic
        ? { ...data, profile_pic: profileConverter(data?.profile_pic) }
        : data;
    }
  } catch (fault) {
    return {
      errMsg:
        fault?.response?.data?.error?.message ||
        fault?.response?.statusText ||
        "Something went wront",
    };
  }
};
export const getSignUp = async (requestInput: LoginRequestInput) => {
  try {
    requestInput.password = encryptPassword(requestInput?.password || "");
    const res = await Axios.post(`api/createUser`, requestInput);
    return res.status === 200 && res.data;
  } catch (fault) {
    return {
      errMsg:
        fault?.response?.data?.error?.message || fault?.response?.statusText,
    };
  }
};

export const updateUser = createAsyncThunk(
  "auth",
  async (formData: { [key: string]: any }) => {
    try {
      const res = await APIInstance.patch("/updateUser", formData);
      if (res.status === 200) {
        let data = res?.data?.data;
        return data?.profile_pic
          ? { ...data, profile_pic: profileConverter(data?.profile_pic) }
          : data;
      } else return {};
    } catch (err) {
      console.error(err);
      return {};
    }
  }
);
