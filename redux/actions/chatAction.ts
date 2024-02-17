import { createAsyncThunk } from "@reduxjs/toolkit";
import APIInstance from "../../utils/api_interceptor";
interface MessageParams {
  chat_id: string;
  page_no: number;
  page_size: number;
}
const getAllChats = createAsyncThunk("chat/getAllChats", async () => {
  try {
    const res = await APIInstance.get("chat/getAllChats");
    if (res?.status === 200) {
      const { data } = res;
      return data.data || [];
    }
  } catch (fault) {
    return [];
  }
});

const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (params: MessageParams) => {
    try {
      const res = await APIInstance.get(`message/${params.chat_id}`, {
        params: {
          page: params.page_no,
          page_size: params.page_size,
        },
      });
      if (res?.status === 200) {
        const { data } = res;
        if (data.data) return { [params.chat_id]: data.data };
        return {};
      }
    } catch (fault) {
      return {
        errMsg:
          fault?.response?.data?.error?.message || fault?.response?.statusText,
      };
    }
  }
);

const sendMessage = async (params: { [key: string]: string }) => {
  try {
    const res = await APIInstance.post("message/sendMessage", params);
    if (res.status === 200) {
      return res.data.data;
    }
  } catch (fault) {
    return {
      errMsg:
        fault?.response?.data?.error?.message || fault?.response?.statusText,
    };
  }
};
const getNotifications = async (params: { [key: string]: string }) => {
  try {
    const res = await APIInstance.post("/getNotification", params);
    return res.status === 200 ? res.data.data : {};
  } catch (fault) {
    return {
      errMsg:
        fault?.response?.data?.error?.message || fault?.response?.statusText,
    };
  }
};

const deleteNotification = async (params: { [key: string]: string }) => {
  try {
    const res = await APIInstance.delete("/deleteNotification", {
      data: params,
    });
    return res;
  } catch (fault) {
    return {
      errMsg:
        fault?.response?.data?.error?.message || fault?.response?.statusText,
    };
  }
};

const findChat = createAsyncThunk(
  "chat/findChat",
  async (params: { [key: string]: string }) => {
    try {
      const res = await APIInstance.get("/findChat", {
        params,
        data: params,
        ...params,
      });
      return res.status === 200 ? res.data.data : [];
    } catch (fault) {
      console.error(
        fault?.response?.data?.error?.message || fault?.response?.statusText
      );
      return [];
    }
  }
);
const getUser = async (params: { [key: string]: string }) => {
  try {
    const res = await APIInstance.post("/getUser", params);
    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
const createGroup = createAsyncThunk(
  "chat/createGroupChat",
  async (params: { [key: string]: string }) => {
    try {
      const res = await APIInstance.post("chat/createGroupChat", params);
      return res.status === 200 ? [res.data.data] : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }
);
const deleteChat = async (params: { [key: string]: Array<string> }) => {
  try {
    const res = await APIInstance.delete("/chat/deleteChat", {
      data: params,
    });
    return res.status === 200 && res.data.data;
  } catch (err) {
    console.error(err);
  }
};
export {
  getAllChats,
  getMessages,
  sendMessage,
  getNotifications,
  deleteNotification,
  findChat,
  getUser,
  createGroup,
  deleteChat,
};
