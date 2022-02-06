import React from "react";
import Logo from '../images/icon-left-font-monochrome-black.svg';

function Header() {
    return (
        <header>
            <img src={Logo} alt="Logo Groupomania noir"/>
        </header>
    );
}

export default Header;