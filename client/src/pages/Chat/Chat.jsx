import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../../utils/APIRoutes";
import { ChatContainerWrapper } from "./Chat.styles";
import Contacts from "../../components/Contacts/Contacts";
import Welcome from "../../components/Welcome/Welcome";
import ChatContainer from "../../components/ChatContainer/ChatContainer";

function Chat() {
    const navigate = useNavigate();
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        let shouldStopCalling = false;
        const updateCurrentUser = async () => {
            if (!shouldStopCalling) {
                if (!localStorage.getItem('chat-app-user')) {
                    navigate("/login");
                } else {
                    const userData = await JSON.parse(localStorage.getItem('chat-app-user'));
                    setCurrentUser(userData);
                }
            }
        }
        updateCurrentUser();
        return () => {
            shouldStopCalling = true;
        }
    }, []);

    useEffect(() => {
        let shouldCallSocket = false;
        const callAddUser = async () => {
            if (currentUser && !shouldCallSocket) {
                socket.current = io(host);
                socket.current.emit("add-user", currentUser._id);
            }
        }
        callAddUser();
        return () => {
            shouldCallSocket = true
        };
    }, [currentUser]);

    useEffect(() => {
        let shouldCallAPI = false;
        const getUserData = async () => {
            if (currentUser && !shouldCallAPI) {
                if (currentUser.isAvatarImageSet) {
                    const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data);
                } else {
                    navigate("/setAvatar");
                }
            }
        }
        getUserData();
        return () => {
            shouldCallAPI = true
        };
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };
    return (
        <>
            <ChatContainerWrapper>
                <div className="container">
                    <Contacts
                        contacts={contacts}
                        changeChat={handleChatChange}
                    />
                    {currentChat === undefined ? (
                        <Welcome />
                    ) : (
                        <ChatContainer
                            currentChat={currentChat}
                            socket={socket}
                        />
                    )}
                </div>
            </ChatContainerWrapper>
        </>
    );
}

export default Chat;