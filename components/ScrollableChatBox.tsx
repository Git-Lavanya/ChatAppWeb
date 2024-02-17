import React, { useRef, useEffect } from "react";
import Styles from "../styles/ChatBoard.module.scss";
import TypingIndicator from "./TypingIndicator";
import { ScrollToBottom } from "../utils/helper_function";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
var selectedChat = "";
function ScrollableChatBox(props): JSX.Element {
  const { messages, userRef, userAuthData, isTyping } = props;
  const containerRef = useRef<HTMLDivElement | null>();
  const editableDiv = document.getElementById("editableDiv");
  const { allMessages } = useSelector((state: RootState) => state.chat);
  useEffect(() => {
    const sender = messages?.[messages.length - 1]?.sender?._id;
    if (
      !isTyping &&
      document.activeElement !== editableDiv &&
      (messages?.length > allMessages[userRef.current["chat_id"]]?.data?.length
        ? sender === userAuthData._id
        : true)
    ) {
      selectedChat = userRef.current?.chat_id;
      ScrollToBottom();
    }
  });

  return (
    <>
      <div className={Styles.chatHeader}>
        <img
          src={`data:image/${userRef.current?.avatar?.contentType};base64,${userRef.current?.avatar?.image}`}
          // src={userRef.current?.avatar}
          alt="Avatar"
          className="avatar"
        />
        <span>
          {userRef.current?.ChatName}
          {isTyping && (
            <div className="typing-span">
              <TypingIndicator />
            </div>
          )}
        </span>
      </div>
      <div
        className={Styles.msg_panel}
        id="srollable-chat-container"
        ref={containerRef}
      >
        {messages?.map((message) => {
          const auther = userAuthData._id === message.sender._id;
          return (
            <div
              className={`${Styles["chat_msg_pane"]} ${
                auther
                  ? Styles["sender_chat_pane"]
                  : Styles["receiver_chat_pane"]
              }`}
              key={message._id}
            >
              {userRef.current.isGroupChat && !auther && (
                <img
                  className={Styles.chat_profile}
                  // src={`${userRef.current.users[message.sender._id]}`}
                  src={`data:image/${
                    userRef.current.users[message.sender._id]?.contentType
                  };base64,${userRef.current.users[message.sender._id]?.image}`}
                />
              )}
              <span className={Styles.chat_pane}>
                {userRef.current.isGroupChat && (
                  <div>{auther ? "You" : message.sender.username}</div>
                )}
                {message.content}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default React.memo(ScrollableChatBox);
