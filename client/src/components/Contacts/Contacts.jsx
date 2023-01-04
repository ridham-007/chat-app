import React, { useState, useEffect } from "react";
import { ContactContainer } from './Contacts.styles';
import Logo from "../../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    useEffect(() => {
        let stopCalling = false;
        const updateCurrentUserData = async () => {
            if (!stopCalling) {
                const data = await JSON.parse(
                    localStorage.getItem('chat-app-user')
                );
                setCurrentUserName(data.username);
                setCurrentUserImage(data.avatarImage);
            }
        }
        updateCurrentUserData();
        return () => {
            stopCalling = true
        }
    }, []);
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };
    return (
        <>
            {currentUserImage && currentUserImage && (
                <ContactContainer>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h3>snappy</h3>
                    </div>
                    <div className="contacts">
                        {contacts.map((contact, index) => {
                            return (
                                <div
                                    key={contact._id}
                                    className={`contact ${index === currentSelected ? "selected" : ""
                                        }`}
                                    onClick={() => changeCurrentChat(index, contact)}
                                >
                                    <div className="avatar">
                                        <img
                                            src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="current-user">
                        <div className="avatar">
                            <img
                                src={`data:image/svg+xml;base64,${currentUserImage}`}
                                alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h2>{currentUserName}</h2>
                        </div>
                    </div>
                </ContactContainer>
            )}
        </>
    );
}
