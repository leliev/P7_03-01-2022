import { UserContext } from "./helpers/userContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Routes from "./components/Routes";
import "./App.css";


function App() {

  const [userState, setUserState] = useState({
    id: 0,
    username: "",
    email: "",
    roles: [],
    isAdmin: false,
    isLoggedin: false
  });

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token || token.length === 0) {
      setUserState({ ...userState, isLoggedin: false});
    } else {
      setUserState({ ...userState, isLoggedin: true});
    }
  },[]);

  return (
    <div className="App">
      <UserContext.Provider value={{userState, setUserState}}>
        <Header />
        <Navbar />
        <Routes />
      </UserContext.Provider>
    </div>
  );
}

export default App;
