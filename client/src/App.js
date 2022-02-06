import React, { useState, useEffect } from "react";
import { UserContext } from "./helpers/userContext";
//import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Routes from "./components/Routes";
import "./App.css";



function App() {

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
    
    if (accessToken !== null) {
      console.log("setting context again")
      
      axios.get(`http://localhost:8080/api/auth`, { headers : { 'x-access-token': accessToken } })
        .then((res) => {
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
      
    }else if (accessToken === null || !accessToken) { 
      setUserState({
        ...userState,
        isLogged: false,
      });
    };
    console.log(userState)
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
