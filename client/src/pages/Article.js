import React, { useEffect, useContext } from "react";
import { UserContext } from "../helpers/userContext";
import { useNavigate } from "react-router-dom";

function Article() {
  const { userState, toggleUserState } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      navigate("/signin")
    } else if (user && userState === false) {
      toggleUserState();
    }
  })

    return (
      <div>
        {userState && (
          <h1>Article page</h1>
        )}
      </div>
      
        
    );
}

export default Article;