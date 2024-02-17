import { createSlice } from "@reduxjs/toolkit";
import {
  getAllChats,
  getMessages,
  findChat,
  createGroup,
} from "../actions/chatAction";
export interface AvatarType {
  image: string;
  contentType: string;
}
export type ChatType = Array<{
  _id: string;
  users: [{ username: string; profile_pic: AvatarType }];
  isGroupChat: Boolean;
  group_profile?: string;
  chatName: string;
  latestMessage: { sender: { username: string }; content: string };
}>;
export interface AllChatsTypes {
  allChats: ChatType;
  allMessages: { [key: string]: any };
  searchedChat: ChatType;
}
const initialState: AllChatsTypes = {
  allChats: [],
  allMessages: {},
  searchedChat: [],
};
const ChatReducer = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.allMessages = { ...state.allMessages, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllChats.fulfilled, (state, action) => {
      state.allChats = action.payload;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.allMessages = { ...state.allMessages, ...action.payload };
    });
    builder.addCase(findChat.fulfilled, (state, action) => {
      state.allChats = action.payload;
    });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.allChats = [...state.allChats, ...action.payload];
    });
  },
});
export default ChatReducer.reducer;
export const { setMessages } = ChatReducer.actions;
