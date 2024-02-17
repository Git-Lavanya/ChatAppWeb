import axios from "axios";
import { API_URL } from "../baseUrl";
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (originalConfig.url !== "/auth/login" && error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const res = await axios.post(`${API_URL}/auth/refreshToken`, {
            refreshToken: localStorage.getItem("refreshToken"),
          });
          if (res.status === 200) {
            localStorage.setItem("refreshToken", res.data.refreshToken);
            return instance({
              ...originalConfig,
              // headers: {
              //   ...originalConfig.headers,
              //   Cookie: originalConfig.headers.cookie,
              // },
              sent: true,
            });
          } else if (res.status === 401) {
            debugger;
            window.location.href = "/login";
          }
        } catch (fault) {
          return Promise.reject(fault);
        }
      }
    } else {
      console.error("Network error");
    }
  }
);
export default instance;
