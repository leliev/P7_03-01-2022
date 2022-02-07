import React, { useState, useEffect } from "react";
import { UserContext } from "./helpers/userContext";
import axios from "axios";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Routes from "./components/Routes";
import "./styles/App.css";

function App() {
  //Set user context state
  const [userState, setUserState] = useState({
    id: 0,
    username: '',
    email: '',
    imageUrl: '',
    accessToken: '',
    isAdmin: false,
    isLogged: false,
  });

  useEffect(() => {
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
    //Check for token and logged state
    if ((accessToken !== null) && !userState.isLogged) {
      //get user data 
      axios.get(process.env.REACT_APP_BASE_URL + `/auth`, { headers : { 'x-access-token': accessToken } })
        .then((res) => {
          //Save user data in context
          const privilege = res.data.roles.includes("ROLE_ADMIN")
          setUserState({
            id: res.data.id,
            username: res.data.username,
            email: res.data.email,
            imageUrl: res.data.imageUrl,
            isAdmin: privilege,
            isLogged: true,
          });
        })
      //Or set context logged off
    }else if (accessToken === null || !accessToken) { 
      setUserState({
        ...userState,
        isLogged: false,
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <UserContext.Provider value={{ userState, setUserState }}>
      <div className="App">
          <Header />
          <Navbar />
          <Routes />
      </div>
    </UserContext.Provider>
  );
}

export default App;
