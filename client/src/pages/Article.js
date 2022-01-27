import React, { useEffect, useContext } from "react";
import { UserContext } from "../helpers/userContext";

function Article() {
    const { userState } = useContext(UserContext);

    useEffect(() => {
        if (!userState.isLoggedin) {
            window.location.replace("/signin");
        }
    });

    return (
        <h1>Login Page</h1>
    );
}

export default Article;