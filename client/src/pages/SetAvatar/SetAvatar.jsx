import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Logo from '../../assets/logo.svg';
import { RegisterWrapper } from './Register.styles';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../../utils/APIRoutes';

function SetAvatar() {
    return (
        <div>SetAvatar</div>
    )
}

export default SetAvatar