import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';

function App() {
    return (<div>
        <BrowserRouter>
            <Routes>
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/setAvatar" element={<Login />} />
                <Route exact path="/" element={<Chat />} />
            </Routes>
        </BrowserRouter>
    </div>)
}

export default App