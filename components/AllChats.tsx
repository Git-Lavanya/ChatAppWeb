import React from "react";
import Styles from "../styles/ChatBoard.module.scss";
import { ChatType, AvatarType } from "../redux/reducers/ChatReducer";
import TypingIndicator from "./TypingIndicator";

interface ChatBoardProps {
  avatar?: AvatarType;
  ChatName: string;
  latestMessage?: { sender: { username: string }; content: string };
  isGroupChat?: Boolean;
}

interface onChatBoxClick {
  onChatBoxClick: (args) => void;
  allChatTyping?: object;
  isTyping?: boolean;
  selectedUserRoom?: { [key: string]: any };
  notification?: { [key: string]: any };
  allChats?: ChatType;
  onMenuClick?: (args) => any;
  MenuIconId?: string;
  hideMenuIcon?: boolean;
}

export const ChatBoard: React.FC<ChatBoardProps & onChatBoxClick> = (props) => {
  const {
    avatar = { contentType: "", image: "" },
    ChatName,
    latestMessage,
    isGroupChat,
    onChatBoxClick,
    isTyping,
    notification,
    onMenuClick,
    MenuIconId,
    hideMenuIcon = false,
  } = props;
  const sender =
    notification?.[notification.length - 1]?.note?.sender?.username ||
    latestMessage?.sender?.username ||
    "";
  return (
    <div className={Styles.chatBoardGrid} onClick={() => onChatBoxClick(props)}>
      <img
        src={`data:image/${avatar.contentType};base64,${avatar.image}`}
        // src={avatar.image}
        alt="Avatar"
        className="avatar"
      />
      <div>
        <p>{ChatName}</p>
        <p>
          {isGroupChat && <span>{sender && <>{sender}&nbsp;</>}</span>}
          {isTyping ? (
            <div className="chatbox-typing-span">
              <TypingIndicator />
            </div>
          ) : notification ? (
            notification[notification.length - 1].note.content
          ) : (
            latestMessage?.content || ""
          )}
        </p>
      </div>
      {notification && <div className="badge">{notification.length}</div>}
      {!hideMenuIcon && (
        <div
          id={MenuIconId || `menu`}
          className={`menuIcon ${Styles["chat-menu"]}`}
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick && onMenuClick(e);
          }}
        />
      )}
    </div>
  );
};
function AllChats(props: onChatBoxClick): JSX.Element {
  const {
    allChats,
    onChatBoxClick,
    allChatTyping,
    selectedUserRoom,
    notification,
    onMenuClick,
  } = props;
  return (
    <>
      {allChats instanceof Array
        ? allChats?.map(
            ({
              _id,
              users,
              isGroupChat,
              group_profile = "",
              chatName,
              latestMessage,
            }) => (
              <ChatBoard
                ChatName={isGroupChat ? chatName : users?.[0]?.username || ""}
                avatar={users?.[0]?.profile_pic}
                isGroupChat={isGroupChat}
                latestMessage={latestMessage}
                key={_id}
                onChatBoxClick={(args) => {
                  onChatBoxClick({ ...args, _id, users });
                }}
                isTyping={
                  allChatTyping?.[_id] && _id !== selectedUserRoom.chat_id
                }
                notification={notification?.[_id]}
                MenuIconId={_id}
                onMenuClick={onMenuClick}
              />
            )
          )
        : null}
    </>
  );
}

export default AllChats;
