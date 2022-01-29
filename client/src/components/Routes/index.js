import React from "react";
import { Routes, Route } from "react-router-dom";
import Article from "../../pages/Article";
import Profile from "../../pages/Profile";
import Signin from "../../pages/Signin"
import Signup from "../../pages/Signup";

function index() {
    return (
        <Routes>
            <Route path="/" element={<Article/>} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user" element={<Profile />} />
        </Routes>
    );
}

export default index;