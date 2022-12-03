import React from 'react';
// import { Link } from 'react-router-dom';
import './navinfo.css'

const NavInfo = () => {
    console.log(window.location.pathname);
    return (
        <div id='nav-info'>
            <p>{window.location.pathname}</p>
        </div>
    );
};

export default NavInfo;