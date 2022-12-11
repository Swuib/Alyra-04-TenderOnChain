import React from 'react';
import './navinfo.css'

const NavInfo = () => {
    return (
        <div id='nav-info'>
            <p>{window.location.pathname}</p>
        </div>
    );
};

export default NavInfo;