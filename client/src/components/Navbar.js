import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../helpers/userContext";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.css"

function Navbar() {

    const { userState } = useContext(UserContext);
    const user = userState;
    const location = useLocation();
    const [active, setActive] = useState("")
    let activePath = toString(location.pathname.split("/")[1]);

    useEffect(() => {
        //Store location to display active navbar link
        setActive(activePath)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location])//Trigger specified rerender

    //Logout function that destroy session storage
    const logout = () => {
        sessionStorage.removeItem("accessToken");
        window.location.replace('/');
    };
    
    return(
        <nav className="container">
            {user.isLogged ? (
            <>
                <NavLink to={'/'} className={!active  && "active"} aria-label="page des articles">
                    Articles
                </NavLink>
                <NavLink to={`/user/${user.username}`} className={(active === "user") && "active"} aria-label="page de profile">
                    Profile
                </NavLink>
                {user.isAdmin && (
                    <NavLink to={'/admin'} className={(active === "admin") && "active"} aria-label="page administrateur">
                        Admin
                    </NavLink>
                )}
                <button aria-label="Déconnexion" onClick={logout}>
                    Logout
                </button>
            </>
            ) : (
            <>
                <NavLink to={'/signin'} className={(active === "signin") && "active"} aria-label="page de connexion">
                    Login
                </NavLink>
                <NavLink to={'/signup'} className={(active === "signup") && "active"} aria-label="page d'inscription">
                    Signup
                </NavLink>
            </>
            )}
        </nav>
    );
};

export default Navbar;
