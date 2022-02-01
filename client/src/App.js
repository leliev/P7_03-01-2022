import React, { useState, useEffect } from "react";
import { UserContext } from "./helpers/userContext";
import { useLocation } from "react-router-dom";
//import { UserProvider } from "./helpers/userContext";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Routes from "./components/Routes";
import "./App.css";



function App() {

  const [userState, setUserState] = useState(false);
  //const { userState, setUserState } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUserState(true);
  }else {
    setUserState(false)
  }
  console.log(userState)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location])

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
