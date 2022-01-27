import React, { useContext } from "react";
import { UserContext } from "../helpers/userContext";
import { NavLink } from "react-router-dom";


function Navbar() {
    const { userState } = useContext(UserContext);

    return(
        <nav className="container">
            {userState.isLoggedin ? (
            <>
                <NavLink to={'/article'} aria-label="page des articles">
                    Articles
                </NavLink>
                <NavLink to={'/user'} aria-label="page de profile">
                    Profile
                </NavLink>
                {userState.isAdmin && (
                    <NavLink to={'/admin'} aria-label="page administrateur">
                        Admin
                    </NavLink>
                )}
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
}
export default Navbar;
