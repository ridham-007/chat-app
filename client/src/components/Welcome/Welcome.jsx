import React, { useState, useEffect } from "react";
import Robot from "../../assets/robot.gif";
import { WelcomeContainer } from './Welcome.styles';

export default function Welcome() {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        let stopCalling = false;
        const updateUsername = async () => {
            if (!stopCalling) {
                setUserName(
                    await JSON.parse(
                        localStorage.getItem('chat-app-user')
                    ).username
                );
            }
            updateUsername();
            return () => {
                stopCalling = true
            }
        }
    }, []);
    return (
        <WelcomeContainer>
            <img src={Robot} alt="" />
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </WelcomeContainer>
    );
}
