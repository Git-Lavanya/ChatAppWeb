import { useEffect, useState, useRef } from "react";
import AllChats, { ChatBoard } from "../components/AllChats";
import { Chats, Auth } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Styles from "../styles/ChatBoard.module.scss";
import ScrollableChatBox from "../components/ScrollableChatBox";
import io from "socket.io-client";
import { ENDPOINT } from "../utils/baseUrl";
import { ScrollToBottom } from "../utils/helper_function";
import Modal from "../components/Modal";
import { Input, Chips, MenuItems, FileUploader } from "../components";
import { AvatarType } from "../redux/reducers/ChatReducer";
var socket, timer;
export default function RootLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const [pageNo, setPageNo] = useState<number>(1);
  const { allChats = [], allMessages } = useSelector(
    (state: RootState) => state.chat
  );
  const { userAuthData = {} } = useSelector((state: RootState) => state.auth);
  const userRef = useRef<{ [key: string]: any }>({
    users: {},
    chat_id: "",
    isGroupChat: false,
  });
  type UserType = Array<{
    _id: string;
    username: string;
    profile_pic: AvatarType;
  }>;
  const inputRef = useRef<HTMLDivElement | null>();
  const [showPlaceholder, SetPlaceholder] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ [key: string]: any }>>();
  const [notification, setNotification] = useState<{ [key: string]: any }>({});
  const [socketConnected, setSocketConnect] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [allChatTyping, setAllChatTyping] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [searchedUsers, setSearchedUsers] = useState<UserType | null>();
  const [groupMembers, setGroupMember] = useState<UserType | null>();
  const [anchorEle, setAnchorEle] = useState<HTMLElement>();
  type MyTimeoutType = ReturnType<typeof setTimeout>;
  const debouncingRef = useRef<MyTimeoutType>();
  const searchBoxRef = useRef<HTMLInputElement>();
  const groupDialogRef = useRef<HTMLInputElement>();
  const groupNameRef = useRef<HTMLInputElement>();
  const ProfileRef = useRef<HTMLInputElement>();
  const pageSize: number = 10;

  //************* GET ALL CHATERS OF THAT LOGIN USER AND SETUP USER'S CHAT ROOM *****************//
  useEffect(() => {
    getNotificationMsg();
    let UserDiscount = () => {
      alert("check");
      socket.off("setup user room", () => {
        socket.leave(userAuthData._id);
      });
    };
    window.addEventListener("beforeunload", UserDiscount);
    dispatch(Chats.getAllChats());
    socket = io(ENDPOINT);
    socket.emit("setup user room", userAuthData);
    socket.on("User Connected", () => setSocketConnect(true));
    socket.on("typing", (room) => {
      if (!isTyping && room === userRef.current["chat_id"]) setIsTyping(true);
      setAllChatTyping((prevState) => ({ ...prevState, [room]: true }));
    });
    socket.on("stop typing", (room) => {
      setIsTyping(false);
      setAllChatTyping((prevState) => ({ ...prevState, [room]: false }));
    });
    return () => {
      window.removeEventListener("beforeunload", UserDiscount);
    };
  }, []);

  //************* RETRIVE ALL MESSAGES OF SELECTED CHATER *****************/
  useEffect(() => {
    if (userRef.current["chat_id"]) {
      setMessages(allMessages[userRef.current["chat_id"]]?.data);
    }
  }, [allMessages]);

  //************* RETRIVE ALL MESSAGES OF SELECTED CHATER *****************/
  useEffect(() => {
    const receiveMessage = async (newMessage) => {
      if (userRef.current["chat_id"] !== newMessage.message._id) {
        getNotificationMsg(newMessage.message._id);
        // if (notification?.[newMessage.message._id])
        //   notification[newMessage.message._id].push({
        //     content: newMessage.content,
        //     sender: newMessage.sender.username,
        //   });
        // else
        //   notification[newMessage.message._id] = [
        //     { content: newMessage.content, sender: newMessage.sender.username },
        //   ];
        // setNotification(notification);
      } else {
        setMessages((prevState) => [
          ...prevState,
          {
            content: newMessage.content,
            sender: {
              username: newMessage.sender.username,
              _id: newMessage.sender._id,
              __v: 0,
            },
            _id: newMessage._id,
          },
        ]);
      }
    };

    socket.on("emit message receive", receiveMessage);
    return () => {
      socket.off("emit message receive", receiveMessage);
    };
  }, []);

  /****************************************
  FUNCTION INVOKED ON CLICK OF CHAT BOX AND 
  REQUEST FETCH CALL FOR MESSAGE THAT BELONGS 
  TO THAT CHAT AND CREATE A CHAT ROOM 
  *****************************************/

  const handleChatClick = (args) => {
    if (args._id) {
      setSelectedChat(args._id);
      if (notification[args._id]) {
        Chats.deleteNotification({ chat_id: args._id });
        delete notification[args._id];
        setNotification(notification);
      }
      userRef.current["chat_id"] = args._id;
      userRef.current["isGroupChat"] = args.isGroupChat;
      userRef.current["chatMembers"] = args.users;
      userRef.current["ChatName"] = args.ChatName;
      userRef.current["avatar"] = args.avatar || "";
      args.users.forEach(
        (user) => (userRef.current["users"][user._id] = user.profile_pic || "")
      );
      dispatch(
        Chats.getMessages({
          chat_id: args._id,
          page_no: pageNo,
          page_size: pageSize,
        })
      );
      socket.emit("join chat room", args._id, userAuthData._id);
    }
  };

  /****************************************
  FUNCTION INVOKED ON CLICKING SEND BUTTON 
  AND REQUEST SEND CALL FOR NEW MESSAGE 
  AND EMIT CHAT RECEIVES SOCKET
  ****************************************/
  const handlePing = async (e) => {
    ScrollToBottom();
    const res = await Chats.sendMessage({
      chat_id: userRef.current["chat_id"],
      content: inputRef?.current?.innerText,
    });
    inputRef.current.innerText = "";
    showPlaceholder && SetPlaceholder(false);
    if (!res.errMsg) {
      setMessages([
        ...messages,
        {
          content: res.content,
          sender: {
            username: res.sender.username,
            _id: res.sender._id,
            __v: 0,
          },
          _id: res._id,
        },
      ]);
      socket.emit("new message", res);
    }
  };
  /****************************************
  FUNCTION INVOKED ON TYPING MESSAGE
  AND SEND TYPING INDICATION TO RECEIVER CHAT
  ****************************************/
  const handleTyping = () => {
    timer && clearTimeout(timer);

    if (!socketConnected) return;
    else if (!typing) {
      setTyping(true);
      socket.emit(
        "typing",
        userRef.current["chatMembers"],
        userAuthData._id,
        userRef.current["chat_id"]
      );
    }
    let lastTypingTime = new Date().getTime();
    let timeLength = 3000;
    timer = setTimeout(() => {
      const currTime = new Date().getTime();
      const timeDiff = currTime - lastTypingTime;
      if (timeDiff >= timeLength && typing) {
        socket.emit(
          "stop typing",
          userRef.current["chatMembers"],
          userAuthData._id,
          userRef.current["chat_id"]
        );
        setTyping(false);
      }
    }, timeLength);
  };

  /****************************************
  FUNCTION TO GET NOTIFICATION MESSAGES
  ****************************************/
  async function getNotificationMsg(chat_id?: string) {
    const res = await Chats.getNotifications(chat_id ? { chat_id } : null);
    setNotification({ ...notification, ...res });
  }

  /****************************************
  FUNCTION TO SEARCH USERS CHAT AND GROUP CHAT
  ****************************************/
  function handleSearchChat(e, type) {
    const { value } = e.target;
    const param = type === "global" ? { chatname: value } : { username: value };
    // const regex = new RegExp(`^${value}`, "i");
    if (searchBoxRef.current && type === "global")
      searchBoxRef.current.value = value;
    if (debouncingRef.current) {
      clearTimeout(debouncingRef.current);
    }
    if (value) {
      debouncingRef.current = setTimeout(async () => {
        if (type === "global") dispatch(Chats.findChat(param));
        else {
          const res = await Chats.getUser(param);
          setSearchedUsers(res);
        }
      }, 800);
    } else if (type === "global") {
      dispatch(Chats.getAllChats());
    }
  }
  /****************************************
  FUNCTION TO CREATE GROUP CHAT
  ****************************************/
  function CreateGroupMethod() {
    dispatch(
      Chats.createGroup({
        chat_name: groupNameRef.current.value,
        members: JSON.stringify(groupMembers),
      })
    );
    groupNameRef.current.value = "";
    setGroupMember([]);
    setModalOpen(false);
  }
  /****************************************
  MENUITEMS CLICK FUNCTION
  ****************************************/
  async function onMenuItemClick(menu) {
    if (menu.id == "delete") {
      const res = await Chats.deleteChat({ chat_id: [anchorEle.id] });
      if (res.deletedCount) dispatch(Chats.getAllChats());
    } else if (menu.id == "createGroup") setModalOpen(true);
    else if (menu.id == "changeProfile") {
      ProfileRef.current.click();
    }
    setAnchorEle(null);
  }
  const MainMenuIcon = (e) => {
    e.stopPropagation();
    setAnchorEle(e.target);
  };
  const ChangeProfile = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("username", userAuthData.username);
    dispatch(Auth.updateUser(formData));
    // var reader = new FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onload = function (e) {
    //   const blob = new Blob([e.target.result], {
    //     type: file.type,
    //   });
    //   let image = window.URL.createObjectURL(blob);
    //   document.getElementById("dp").setAttribute("src", image);
    // };
  };
  return (
    <>
      <div className={Styles.chat_app_container}>
        <nav>
          <div className={`${Styles.chatHeader} ${Styles.Chater_Head}`}>
            <span id="main-menu" className="menuIcon" onClick={MainMenuIcon} />
            <img
              src={`${userAuthData?.profile_pic?.image}`}
              alt="Avatar"
              className="avatar"
              id="dp"
              // width={300}
              // height={300}
            />
            <FileUploader
              type="image/*"
              handleUpload={ChangeProfile}
              ref={ProfileRef}
            />
            <Input
              onChange={(e) => handleSearchChat(e, "global")}
              ref={searchBoxRef}
              onCancel={() => {
                dispatch(Chats.getAllChats());
              }}
            />
          </div>
          <AllChats
            allChats={allChats}
            onChatBoxClick={handleChatClick}
            allChatTyping={allChatTyping}
            selectedUserRoom={userRef.current}
            notification={notification}
            onMenuClick={(e) => setAnchorEle(e.currentTarget)}
          />
        </nav>
        {userRef.current["chat_id"] && (
          <section>
            <ScrollableChatBox
              messages={messages}
              userRef={{ ...userRef, selectedChat }}
              userAuthData={userAuthData}
              isTyping={isTyping}
            />
            <div className={Styles.chatting_pane}>
              <div
                className={Styles.editableDiv}
                contentEditable="true"
                id="editableDiv"
                ref={inputRef}
                onFocus={() => SetPlaceholder(true)}
                onBlur={() =>
                  !inputRef.current.innerText && SetPlaceholder(false)
                }
                onInput={handleTyping}
                dangerouslySetInnerHTML={{
                  __html: !showPlaceholder ? "Begin chat here" : "",
                }}
              />
              <img
                src="../resources/images/send-chat.png"
                onClick={handlePing}
              />
            </div>
          </section>
        )}
      </div>
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <div>
          <div className={Styles.flex} style={{ marginBottom: "20px" }}>
            <button onClick={CreateGroupMethod}>Create</button>
            <Input ref={groupNameRef} placeholder="Enter Group Name" />
          </div>
          <div className={Styles.flex}>
            <Chips
              data={groupMembers}
              onChipClick={(data) => {
                setGroupMember(data);
              }}
            />
          </div>
          <Input
            onChange={(e) => handleSearchChat(e, "group")}
            ref={groupDialogRef}
            placeholder="Search Member"
          />
          {searchedUsers?.map((user) => (
            <ChatBoard
              ChatName={user.username || ""}
              avatar={user.profile_pic}
              key={user._id}
              onChatBoxClick={() => {
                setGroupMember((prevState) => [...(prevState || []), user]);
                if (groupDialogRef?.current) groupDialogRef.current.value = "";
              }}
              hideMenuIcon={true}
            />
          ))}
        </div>
      </Modal>
      <MenuItems
        list={
          anchorEle?.id === "main-menu"
            ? [
                { id: "createGroup", name: "Create Group" },
                { id: "changeProfile", name: "Change Profile" },
              ]
            : [{ id: "delete", name: "Delete" }]
        }
        anchorEle={anchorEle}
        onMenuItemClick={onMenuItemClick}
        onFocusOut={() => setAnchorEle(null)}
      />
    </>
  );
}
