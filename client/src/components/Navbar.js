import React, { useContext } from "react";
import { UserContext } from "../helpers/userContext";
import { NavLink } from "react-router-dom";


function Navbar() {

    const { userState } = useContext(UserContext);
    const user = userState;
    let privilege = null;

    if (!user.isLogged) {
        privilege = false;
    } else {
        privilege = user.isAdmin;
    };
    
    const logout = () => {
        sessionStorage.removeItem("accessToken");
        window.location.replace('/');
    };
    
    return(
        <nav className="container">
            {userState.isLogged ? (
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
