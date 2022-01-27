import React from "react";
import Logo from '../images/icon-left-font-monochrome-black.svg';

function Header() {
    return (
        <header>
            <div>
                <img src={Logo} alt="Logo Groupomania noir"/>
            </div>
        </header>
    );
}

export default Header;