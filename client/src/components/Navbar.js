import React, { useContext, useEffect } from "react";
import { UserContext } from "../helpers/userContext";
import { NavLink, useLocation } from "react-router-dom";


function Navbar() {

    const location = useLocation();
    const { userState, setUserState } = useContext(UserContext);
    const user = JSON.parse(sessionStorage.getItem("user"));
    let privilege = null;

    if (!user) {
        privilege = false;
    } else {
        privilege = user.roles.includes("ROLE_ADMIN");
    };

    useEffect(() => {
        console.log(userState)
        if (user && userState === false) {
            setUserState(true);
        } 
         
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location]);
    
    const logout = () => {
        sessionStorage.removeItem("user");
        window.location.replace('/');
    };
    
    return(
        <nav className="container">
            {userState ? (
            <>
                <NavLink to={'/'} aria-label="page des articles">
                    Articles
                </NavLink>
                <NavLink to={`/user/${user.username}`} aria-label="page de profile">
                    Profile
                </NavLink>
                {privilege && (
                    <NavLink to={'/admin'} aria-label="page administrateur">
                        Admin
                    </NavLink>
                )}
                <button aria-label="Déconnexion" onClick={logout}>
                    logout
                </button>
            </>
            ) : (
            <>
                <NavLink to={'/signin'} aria-label="page de connexion">
                    Login
                </NavLink>
                <NavLink to={'/signup'} aria-label="page d'inscription">
                    Signup
                </NavLink>
            </>
            )}
        </nav>
    );
};

export default Navbar;
