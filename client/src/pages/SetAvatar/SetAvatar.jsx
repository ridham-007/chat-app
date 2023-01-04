import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import loader from '../../assets/loader.gif';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../../utils/APIRoutes';
import { ContainerDiv } from './SetAvatar.styles';
import { Buffer } from 'buffer';

function SetAvatar() {
    const api = "https://api.multiavatar.com";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAavatar] = useState(undefined);
    useEffect(() => {
        if (!localStorage.getItem('chat-app-user')) {
            navigate('/login');
        }
    }, [])
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select profile picture", toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem('chat-app-user'));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar]
            });
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user", JSON.stringify(user));
                navigate('/');
            } else {
                toast.error("Error setting avatar. Please try again", toastOptions)
            }
        }
    };

    useEffect(() => {
        let stopCalling = false;
        const updateImageData = async () => {
            if (!stopCalling) {
                const data = [];
                for (let i = 0; i < 4; i++) {
                    const image = await axios.get(`${api}/${Math.floor(Math.random() * 1000)}`);
                    const buffer = new Buffer(image.data);
                    data.push(buffer.toString('base64'));
                }
                setAvatars(data);
                setIsLoading(false);
            }
        }
        updateImageData();
        return () => {
            stopCalling = true
        }
    }, [])

    return (
        <>
            {
                isLoading ? (
                    <ContainerDiv>
                        <img src={loader} />
                    </ContainerDiv>
                ) : (
                    <ContainerDiv>
                        <div className="title-container">
                            <h1>Pick an avatar as your profile picture.</h1>
                        </div>
                        <div className="avatars">
                            {avatars.map((avt, index) => {
                                return (
                                    <div className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                        <img
                                            src={`data:image/svg+xml;base64,${avt}`}
                                            alt="avt"
                                            onClick={() => setSelectedAavatar(index)} />
                                    </div>
                                );
                            })}
                        </div>
                        <button class="submit-btn" onClick={setProfilePicture}>Set as a Profile Picture</button>
                    </ContainerDiv>
                )
            }
            <ToastContainer />
        </>
    )
}

export default SetAvatar