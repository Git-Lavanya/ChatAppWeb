import AuthReducer, { setLoginAuthData } from "./AuthReducer";
import ChatReducer, { setMessages } from "./ChatReducer";
// type RootState = {
//   auth: ReturnType<typeof AuthReducer>;
//   chat: ReturnType<typeof ChatReducer>;
// };
const reducer = (state, action) => {
  return {
    auth: AuthReducer(state?.auth, action),
    chat: ChatReducer(state?.chat, action),
  };
};
export default reducer;
export { setLoginAuthData, setMessages };
