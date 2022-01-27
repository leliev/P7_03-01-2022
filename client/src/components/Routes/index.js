import React from "react";
import { Routes, Route } from "react-router-dom";
import Article from "../../pages/Article";
import Login from "../../pages/Login";
import Signup from "../../pages/Signup";

function index() {
    return (
        <Routes>
            <Route path="/" element={<Article/>} />
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    );
}

export default index;