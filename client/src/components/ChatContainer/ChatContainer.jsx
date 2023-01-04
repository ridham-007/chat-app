import React, { useState, useEffect, useRef } from "react";
import ChatInput from "../ChatInput/ChatInput";
import Logout from "../Logout/Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, getAllMessagesRoute } from "../../utils/APIRoutes";
import { ChatWrapperContainer } from './ChatContainer.styles';

export default function ChatContainer({ currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        let shouldUpdateMessages = false;
        const updateMessages = async () => {
            if (!shouldUpdateMessages) {
                const data = await JSON.parse(
                    localStorage.getItem('chat-app-user')
                );
                const response = await axios.post(getAllMessagesRoute, {
                    from: data._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            }
        };
        updateMessages();
        return () => {
            shouldUpdateMessages = true;
        };
    }, [currentChat]);

    useEffect(() => {
        let shouldUpdateChat = false;
        const getCurrentChat = async () => {
            if (currentChat && !shouldUpdateChat) {
                await JSON.parse(
                    localStorage.getItem('chat-app-user')
                )._id;
            }
        };
        getCurrentChat();
        return () => {
            shouldUpdateChat = true;
        };
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        const data = await JSON.parse(
            localStorage.getItem('chat-app-user')
        );
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: data._id,
            msg,
        });
        await axios.post(sendMessageRoute, {
            from: data._id,
            to: currentChat._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    useEffect(() => {
        let stopCallUpdateMessage = false;
        const updateMessages = () => {
            if (!stopCallUpdateMessage) {
                arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
            }
        }
        updateMessages();
        return () => {
            stopCallUpdateMessage = true
        }
    }, [arrivalMessage]);

    useEffect(() => {
        let stopCalling = false;
        const updateScrolling = () => {
            if (!stopCalling) {
                scrollRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
        updateScrolling();
        return () => {
            stopCalling = true
        }
    }, [messages]);

    return (
        <ChatWrapperContainer>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt=""
                        />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages">
                {messages.map((message) => {
                    return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div
                                className={`message ${message.fromSelf ? "sended" : "recieved"
                                    }`}
                            >
                                <div className="content ">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </ChatWrapperContainer>
    );
}


