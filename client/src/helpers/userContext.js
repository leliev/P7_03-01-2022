import { useState, createContext } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userState, setUserState] = useState(false);
    /*const toggleUserState = () => {
        setUserState(userState === false ? true : false)
    }*/

      return (
          <UserContext.Provider value={{ userState, setUserState }}>
              {children}
          </UserContext.Provider>
      )
}

